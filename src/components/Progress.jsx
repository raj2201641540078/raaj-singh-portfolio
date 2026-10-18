/* eslint-disable react/prop-types */
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  BookOpen,
  Check,
  ChevronDown,
  CircleHelp,
  Code2,
  ExternalLink,
  GitBranch,
  Github,
  GitPullRequest,
  FileText,
  Image as ImageIcon,
  Pencil,
  Plus,
  Save,
  RefreshCw,
  Star,
  Trash2,
  Upload,
  Users,
  X,
} from "lucide-react";
import "./Progress.css";

const GITHUB_USER_KEY = "developer-progress-github-user";
const DSA_LOG_KEY = "developer-progress-dsa-log";
const STUDY_PROGRESS_KEY = "developer-progress-study-status";
const STUDY_NOTES_KEY = "developer-progress-study-notes";
const STUDY_DETAILS_KEY = "developer-progress-study-details";
const STUDY_TOPICS_KEY = "developer-progress-study-topics";
const DESIGN_DATABASE_NAME = "developer-progress-designs";
const DESIGN_DATABASE_VERSION = 1;
const DESIGN_STORE_NAME = "weekly-designs";
const STUDY_STATUSES = ["Not Started", "Learning", "Practicing", "Completed"];
const MAX_DESIGN_IMAGES = 8;
const MAX_DESIGN_IMAGE_SIZE = 5 * 1024 * 1024;
const DEFAULT_GITHUB_USER = "raj2201641540078";
const CODOLIO_PROFILE_NAME = "Rajsingh";
const CODOLIO_PROFILE_URL = `https://codolio.com/profile/${CODOLIO_PROFILE_NAME}`;
const DAY_MS = 24 * 60 * 60 * 1000;

const STUDY_SUBJECTS = {
  operatingSystems: {
    label: "Operating Systems",
    heading: "Operating System Engineering",
    description: "Build a practical understanding of operating systems, Linux, and low-level systems concepts.",
    topics: [
      "Processes and threads",
      "CPU scheduling",
      "Process synchronization",
      "Deadlocks",
      "Memory management",
      "Virtual memory and paging",
      "File systems",
      "I/O and DMA",
      "Linux and shell programming",
      "System calls",
    ],
  },
  javaBackend: {
    label: "Java Backend",
    heading: "Java Backend Engineering",
    description: "Track progress through Java fundamentals, Spring services, APIs, and production backend practices.",
    topics: [
      "Core Java and OOP",
      "Collections and generics",
      "Exceptions and testing",
      "Concurrency and threads",
      "JVM and memory management",
      "Spring Boot fundamentals",
      "REST APIs and validation",
      "Authentication and authorization",
      "Backend testing",
      "Build and deployment",
    ],
  },
  microservices: {
    label: "Microservices",
    heading: "Microservices Engineering",
    description: "Learn service boundaries, communication patterns, resilience, and operating distributed services.",
    topics: [
      "Service decomposition",
      "Service discovery",
      "API gateway patterns",
      "Synchronous communication",
      "Event-driven services",
      "Service resilience",
      "Distributed tracing",
      "Configuration management",
      "Data consistency",
      "Deployment and orchestration",
    ],
  },
  databaseOptimization: {
    label: "Database Optimization",
    heading: "Database Design & Optimization",
    description: "Practice designing schemas and improving the performance and reliability of data systems.",
    topics: [
      "Relational data modeling",
      "SQL query planning",
      "Indexes and execution plans",
      "Transactions and isolation",
      "Connection pooling",
      "Caching and query patterns",
      "Database normalization",
      "Replication",
      "Partitioning and sharding",
      "Performance troubleshooting",
    ],
  },
  systemDesign: {
    label: "System Design",
    heading: "System Design",
    description: "Record your progress through distributed systems foundations and practical design case studies.",
    topics: [
      "Scalability and performance",
      "Availability and reliability",
      "Load balancing",
      "Caching strategies",
      "SQL vs. NoSQL",
      "Replication and sharding",
      "Message queues",
      "API design and rate limiting",
      "URL shortener case study",
      "Notification system case study",
      "Chat application case study",
      "News feed case study",
    ],
  },
  aws: {
    label: "AWS",
    heading: "AWS Cloud Engineering",
    description: "Track foundational AWS services, secure cloud architecture, and deployment skills.",
    topics: [
      "AWS account and IAM",
      "VPC and networking",
      "EC2 and auto scaling",
      "S3 and storage",
      "RDS and databases",
      "Load balancers",
      "CloudWatch and monitoring",
      "Lambda and serverless",
      "Infrastructure as code",
      "Security and cost management",
    ],
  },
  kubernetes: {
    label: "Kubernetes",
    heading: "Kubernetes & Containers",
    description: "Build confidence packaging, deploying, and operating containerized applications.",
    topics: [
      "Containers and images",
      "Pods and deployments",
      "Services and networking",
      "ConfigMaps and secrets",
      "Persistent storage",
      "Readiness and liveness probes",
      "Resource requests and limits",
      "Ingress and routing",
      "Helm and releases",
      "Observability and troubleshooting",
    ],
  },
  kafka: {
    label: "Kafka",
    heading: "Apache Kafka",
    description: "Learn event streaming from core broker concepts to reliable production consumers.",
    topics: [
      "Topics and partitions",
      "Producers and consumers",
      "Consumer groups",
      "Offsets and delivery semantics",
      "Replication and fault tolerance",
      "Schema evolution",
      "Stream processing",
      "Retry and dead-letter patterns",
      "Kafka Connect",
      "Monitoring and operations",
    ],
  },
};

const topicKey = (subjectId, topic) => `${subjectId}::${topic}`;
const TRACKER_OPTIONS = [
  { value: "dsa", label: "DSA Tracker", icon: Code2 },
  { value: "github", label: "GitHub Tracker", icon: Github },
  { group: "Study roadmaps" },
  ...Object.entries(STUDY_SUBJECTS).map(([value, subject]) => ({ value, label: subject.label, icon: BookOpen })),
  { group: "Coding journey" },
  { value: "codingJourney", label: "Coding Journey · Codolio", icon: Activity },
];

const getStoredValue = (key, fallback) => {
  try {
    const value = window.localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
};

let designDatabasePromise;

const openDesignDatabase = () => {
  if (!("indexedDB" in window)) {
    return Promise.reject(new Error("Image storage is not supported in this browser."));
  }
  if (!designDatabasePromise) {
    designDatabasePromise = new Promise((resolve, reject) => {
      const request = window.indexedDB.open(DESIGN_DATABASE_NAME, DESIGN_DATABASE_VERSION);
      request.onupgradeneeded = () => {
        if (!request.result.objectStoreNames.contains(DESIGN_STORE_NAME)) {
          request.result.createObjectStore(DESIGN_STORE_NAME, { keyPath: "id" });
        }
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error || new Error("Could not open local design storage."));
      request.onblocked = () => reject(new Error("Local design storage is blocked by another browser tab."));
    }).catch((error) => {
      designDatabasePromise = undefined;
      throw error;
    });
  }
  return designDatabasePromise;
};

const getSubjectDesigns = async (subjectId) => {
  const database = await openDesignDatabase();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(DESIGN_STORE_NAME, "readonly");
    const request = transaction.objectStore(DESIGN_STORE_NAME).getAll();
    request.onsuccess = () => resolve(request.result.filter((design) => design.subjectId === subjectId));
    request.onerror = () => reject(request.error || new Error("Could not load saved designs."));
    transaction.onerror = () => reject(transaction.error || new Error("Could not read saved designs."));
  });
};

const writeDesign = async (design) => {
  const database = await openDesignDatabase();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(DESIGN_STORE_NAME, "readwrite");
    transaction.objectStore(DESIGN_STORE_NAME).put(design);
    transaction.oncomplete = resolve;
    transaction.onerror = () => reject(transaction.error || new Error("Could not save this design."));
    transaction.onabort = () => reject(transaction.error || new Error("Saving this design was interrupted."));
  });
};

const removeDesign = async (designId) => {
  const database = await openDesignDatabase();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(DESIGN_STORE_NAME, "readwrite");
    transaction.objectStore(DESIGN_STORE_NAME).delete(designId);
    transaction.oncomplete = resolve;
    transaction.onerror = () => reject(transaction.error || new Error("Could not delete this design."));
    transaction.onabort = () => reject(transaction.error || new Error("Deleting this design was interrupted."));
  });
};

const dateKey = (date) => {
  const localDate = new Date(date);
  const year = localDate.getFullYear();
  const month = String(localDate.getMonth() + 1).padStart(2, "0");
  const day = String(localDate.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const formatDate = (date) =>
  new Intl.DateTimeFormat(undefined, { month: "short", day: "numeric" }).format(
    new Date(date),
  );

const getJSON = async (url, signal) => {
  const response = await fetch(url, {
    headers: { Accept: "application/vnd.github+json" },
    signal,
  });
  if (!response.ok) {
    throw new Error(
      response.status === 403
        ? "GitHub API rate limit reached. Please try again later."
        : `GitHub returned ${response.status}. Check the username and try again.`,
    );
  }
  return response.json();
};

const makeHeatmap = (counts, days = 364) => {
  const today = new Date();
  const start = new Date(today);
  start.setDate(today.getDate() - (days - 1));
  start.setHours(0, 0, 0, 0);
  start.setDate(start.getDate() - start.getDay());

  return Array.from({ length: Math.ceil(days / 7) }, (_, week) =>
    Array.from({ length: 7 }, (_, weekday) => {
      const date = new Date(start);
      date.setDate(start.getDate() + week * 7 + weekday);
      const key = dateKey(date);
      const count = counts[key] || 0;
      return { key, date, count, inRange: date <= today && date >= new Date(today.getTime() - days * DAY_MS) };
    }),
  );
};

const activityLevel = (count) => {
  if (!count) return "level-0";
  if (count < 2) return "level-1";
  if (count < 4) return "level-2";
  if (count < 7) return "level-3";
  return "level-4";
};

function MetricCard({ label, value, detail, icon: Icon, accent }) {
  return (
    <article className="progress-card progress-metric">
      <div className={`progress-metric-icon ${accent}`}>
        <Icon size={18} aria-hidden="true" />
      </div>
      <p>{label}</p>
      <strong>{value}</strong>
      <span>{detail}</span>
    </article>
  );
}

function TrackerPicker({ value, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const pickerRef = useRef(null);
  const triggerRef = useRef(null);
  const selected = TRACKER_OPTIONS.find((option) => option.value === value) || TRACKER_OPTIONS[0];
  const SelectedIcon = selected.icon;

  useEffect(() => {
    if (!isOpen) return undefined;
    const handlePointerDown = (event) => {
      if (!pickerRef.current?.contains(event.target)) setIsOpen(false);
    };
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    };
    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const choose = (option) => {
    onChange(option.value);
    setIsOpen(false);
    triggerRef.current?.focus();
  };

  return (
    <div className={`tracker-picker${isOpen ? " is-open" : ""}`} ref={pickerRef}>
      <span className="tracker-picker-label">Choose tracker</span>
      <button
        ref={triggerRef}
        type="button"
        className="tracker-picker-trigger"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls="tracker-picker-list"
        onClick={() => setIsOpen((open) => !open)}
        onKeyDown={(event) => {
          if (event.key === "ArrowDown" || event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            setIsOpen(true);
          }
        }}
      >
        <span className="tracker-picker-current-icon"><SelectedIcon size={19} /></span>
        <span className="tracker-picker-current-text">
          <strong>{selected.label}</strong>
          <small>{selected.value === "codingJourney" ? "Coding journey" : selected.value === "dsa" || selected.value === "github" ? "Developer activity" : "Study roadmap"}</small>
        </span>
        <ChevronDown size={19} className="tracker-picker-chevron" />
      </button>
      {isOpen && (
        <div className="tracker-picker-menu" id="tracker-picker-list" role="listbox" aria-label="Choose a progress tracker">
          {TRACKER_OPTIONS.map((option) => {
            if (option.group) return <div className="tracker-picker-group" key={option.group}>{option.group}</div>;
            const OptionIcon = option.icon;
            return (
              <button
                key={option.value}
                type="button"
                role="option"
                aria-selected={value === option.value}
                className={`tracker-picker-option${value === option.value ? " selected" : ""}`}
                onClick={() => choose(option)}
                onKeyDown={(event) => {
                  if (event.key === "ArrowDown" || event.key === "ArrowUp") {
                    event.preventDefault();
                    const options = pickerRef.current?.querySelectorAll('[role="option"]');
                    const currentIndex = Array.from(options || []).indexOf(event.currentTarget);
                    const nextIndex = (currentIndex + (event.key === "ArrowDown" ? 1 : -1) + TRACKER_OPTIONS.filter((item) => item.value).length) % TRACKER_OPTIONS.filter((item) => item.value).length;
                    options?.[nextIndex]?.focus();
                  }
                  if (event.key === "Escape") {
                    setIsOpen(false);
                    triggerRef.current?.focus();
                  }
                }}
              >
                <span className="tracker-picker-option-icon"><OptionIcon size={17} /></span>
                <span className="tracker-picker-option-text">{option.label}</span>
                {value === option.value && <Check size={16} className="tracker-picker-check" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

function Heatmap({ counts, title, totalLabel, year }) {
  const weeks = useMemo(() => makeHeatmap(counts), [counts]);
  const total = Object.values(counts).reduce((sum, value) => sum + value, 0);

  return (
    <section className="progress-card progress-heatmap">
      <div className="progress-section-heading">
        <div>
          <p className="progress-eyebrow">{year}</p>
          <h2>{total.toLocaleString()} {totalLabel}</h2>
        </div>
        <span className="progress-source">{title}</span>
      </div>
      <div className="heatmap-scroll">
        <div className="heatmap-months" aria-hidden="true">
          {weeks.map((week, index) => {
            const firstDate = week.find((day) => day.date.getDate() <= 7);
            return (
              <span key={index}>
                {firstDate && firstDate.date.getDay() === 0
                  ? firstDate.date.toLocaleDateString(undefined, { month: "short" })
                  : ""}
              </span>
            );
          })}
        </div>
        <div className="heatmap-layout">
          <div className="heatmap-weekdays" aria-hidden="true">
            <span>Mon</span><span>Wed</span><span>Fri</span>
          </div>
          <div className="heatmap-grid" role="group" aria-label={`${title} activity heatmap`}>
            {weeks.flatMap((week, weekIndex) =>
              week.map((day) => (
                <span
                  key={`${weekIndex}-${day.key}`}
                  className={`heatmap-cell ${activityLevel(day.count)} ${day.inRange ? "" : "heatmap-outside"}`}
                  title={`${day.count} ${totalLabel} on ${day.date.toLocaleDateString()}`}
                  aria-label={`${day.count} ${totalLabel} on ${day.date.toLocaleDateString()}`}
                />
              )),
            )}
          </div>
        </div>
      </div>
      <div className="heatmap-legend">
        <span>Less</span>
        {[0, 1, 2, 4, 7].map((count) => (
          <span key={count} className={`heatmap-cell ${activityLevel(count)}`} aria-hidden="true" />
        ))}
        <span>More</span>
      </div>
    </section>
  );
}

function ProgressCharts({ topics, statuses }) {
  const totals = topics.reduce(
    (result, topic) => {
      const status = statuses[topic] || "Not Started";
      result[status] += 1;
      return result;
    },
    { Completed: 0, Learning: 0, Practicing: 0, "Not Started": 0 },
  );
  const colors = {
    Completed: "#38d39f",
    Learning: "#7295ff",
    Practicing: "#efbd63",
    "Not Started": "#334158",
  };
  const values = Object.entries(totals);
  const total = topics.length || 1;
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;

  return (
    <section className="progress-card subject-analytics">
      <div className="progress-section-heading">
        <div><p className="progress-eyebrow">Your recorded learning</p><h2>Progress analytics</h2></div>
      </div>
      <div className="subject-chart-grid">
        <div className="subject-donut-wrap">
          <svg className="subject-donut" viewBox="0 0 120 120" role="img" aria-label={`${totals.Completed} of ${topics.length} topics completed`}>
            <circle cx="60" cy="60" r={radius} fill="none" stroke="#1b2638" strokeWidth="15" />
            {values.map(([status, value]) => {
              const segment = (value / total) * circumference;
              const circle = (
                <circle
                  key={status}
                  cx="60"
                  cy="60"
                  r={radius}
                  fill="none"
                  stroke={colors[status]}
                  strokeWidth="15"
                  strokeDasharray={`${segment} ${circumference - segment}`}
                  strokeDashoffset={-offset}
                  transform="rotate(-90 60 60)"
                />
              );
              offset += segment;
              return circle;
            })}
            <text x="60" y="56" textAnchor="middle" className="donut-value">{Math.round((totals.Completed / total) * 100)}%</text>
            <text x="60" y="72" textAnchor="middle" className="donut-label">complete</text>
          </svg>
          <div className="subject-chart-legend">
            {values.map(([status, value]) => (
              <span key={status}><i style={{ background: colors[status] }} />{status}<strong>{value}</strong></span>
            ))}
          </div>
        </div>
        <div className="subject-bar-chart" role="img" aria-label="Topic counts by progress status">
          {values.map(([status, value]) => (
            <div className="subject-bar-row" key={status}>
              <span>{status}</span>
              <div className="subject-bar-track"><i style={{ width: `${(value / total) * 100}%`, background: colors[status] }} /></div>
              <strong>{value}</strong>
            </div>
          ))}
          <p>Topic counts reflect the status you select below.</p>
        </div>
      </div>
    </section>
  );
}

function TopicDropdown({ label, value, options, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const triggerRef = useRef(null);
  const optionRefs = useRef([]);
  const listId = `topic-dropdown-${label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;

  useEffect(() => {
    if (!isOpen) return undefined;
    const handlePointerDown = (event) => {
      if (!dropdownRef.current?.contains(event.target)) setIsOpen(false);
    };
    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [isOpen]);

  const handleTriggerKeyDown = (event) => {
    if (event.key === "Escape" && isOpen) {
      event.stopPropagation();
      setIsOpen(false);
    } else if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      setIsOpen(true);
      requestAnimationFrame(() => optionRefs.current[event.key === "ArrowDown" ? 0 : options.length - 1]?.focus());
    }
  };

  const handleOptionKeyDown = (event, index) => {
    if (event.key === "Escape") {
      event.stopPropagation();
      setIsOpen(false);
      triggerRef.current?.focus();
      return;
    }
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      const direction = event.key === "ArrowDown" ? 1 : -1;
      optionRefs.current[(index + direction + options.length) % options.length]?.focus();
    }
    if (event.key === "Home" || event.key === "End") {
      event.preventDefault();
      optionRefs.current[event.key === "Home" ? 0 : options.length - 1]?.focus();
    }
  };

  return (
    <div className={`topic-dialog-field topic-dropdown-field${isOpen ? " is-open" : ""}`} ref={dropdownRef}>
      <span>{label}</span>
      <button
        ref={triggerRef}
        type="button"
        className="topic-dropdown-trigger"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={listId}
        onClick={() => setIsOpen((open) => !open)}
        onKeyDown={handleTriggerKeyDown}
      >
        <span>{value}</span><ChevronDown size={15} aria-hidden="true" />
      </button>
      {isOpen && (
        <div className="topic-dropdown-options" id={listId} role="listbox" aria-label={label}>
          {options.map((option, index) => (
            <button
              ref={(element) => { optionRefs.current[index] = element; }}
              key={option}
              type="button"
              role="option"
              aria-selected={option === value}
              className={`topic-dropdown-option${option === value ? " selected" : ""}`}
              onClick={() => {
                onChange(option);
                setIsOpen(false);
                triggerRef.current?.focus();
              }}
              onKeyDown={(event) => handleOptionKeyDown(event, index)}
            >{option}</button>
          ))}
        </div>
      )}
    </div>
  );
}

function TopicDetailsDialog({ subject, topic, status, details, note, onClose, onSave }) {
  const [draft, setDraft] = useState(() => ({
    status,
    confidence: details?.confidence || "Not assessed",
    startedOn: details?.startedOn || "",
    lastReviewed: details?.lastReviewed || "",
    nextReview: details?.nextReview || "",
    attempts: Number.isFinite(Number(details?.attempts)) ? Number(details.attempts) : 0,
    concepts: Array.isArray(details?.concepts) ? details.concepts : [],
    notes: note || "",
    referenceLinks: details?.referenceLinks || "",
    designLink: details?.designLink || "",
  }));
  const [conceptInput, setConceptInput] = useState("");

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const addConcept = (event) => {
    if (event.key !== "Enter") return;
    event.preventDefault();
    const concept = conceptInput.trim();
    if (concept && !draft.concepts.includes(concept)) {
      setDraft((current) => ({ ...current, concepts: [...current.concepts, concept] }));
    }
    setConceptInput("");
  };

  const updateField = (field) => (event) => {
    setDraft((current) => ({ ...current, [field]: event.target.value }));
  };

  const save = (event) => {
    event.preventDefault();
    onSave({ ...draft, attempts: Math.max(0, Number(draft.attempts) || 0) });
    onClose();
  };

  return (
    <div className="topic-dialog-backdrop" onMouseDown={(event) => {
      if (event.target === event.currentTarget) onClose();
    }}>
      <section className="topic-details-dialog" role="dialog" aria-modal="true" aria-labelledby="topic-dialog-title">
        <form onSubmit={save}>
          <header className="topic-dialog-header">
            <div><p className="progress-eyebrow">{subject.label}</p><h2 id="topic-dialog-title">{topic}</h2></div>
            <button type="button" className="topic-dialog-close" onClick={onClose} aria-label="Close topic details"><X size={17} /></button>
          </header>
          <div className="topic-dialog-fields">
            <TopicDropdown
              label="Status"
              value={draft.status}
              options={STUDY_STATUSES}
              onChange={(value) => setDraft((current) => ({ ...current, status: value }))}
            />
            <TopicDropdown
              label="Self-assessed confidence"
              value={draft.confidence}
              options={["Not assessed", "Beginner", "Developing", "Confident", "Strong"]}
              onChange={(value) => setDraft((current) => ({ ...current, confidence: value }))}
            />
            <label className="topic-dialog-field">Started on
              <input type="date" value={draft.startedOn} onChange={updateField("startedOn")} />
            </label>
            <label className="topic-dialog-field">Last reviewed
              <input type="date" value={draft.lastReviewed} onChange={updateField("lastReviewed")} />
            </label>
            <label className="topic-dialog-field">Next review reminder
              <input type="date" value={draft.nextReview} onChange={updateField("nextReview")} />
            </label>
            <label className="topic-dialog-field">Practice attempts
              <input type="number" min="0" step="1" value={draft.attempts} onChange={updateField("attempts")} />
            </label>
          </div>
          <button
            type="button"
            className="topic-reviewed-button"
            onClick={() => setDraft((current) => ({ ...current, lastReviewed: dateKey(new Date()) }))}
          ><Check size={14} /> Mark reviewed today</button>
          <label className="topic-dialog-field topic-dialog-full">Key concepts understood
            <input
              value={conceptInput}
              onChange={(event) => setConceptInput(event.target.value)}
              onKeyDown={addConcept}
              placeholder="Type a concept and press Enter"
            />
            {draft.concepts.length > 0 && (
              <span className="topic-concept-list">
                {draft.concepts.map((concept) => (
                  <button key={concept} type="button" onClick={() => setDraft((current) => ({ ...current, concepts: current.concepts.filter((item) => item !== concept) }))}>
                    {concept}<X size={12} aria-label={`Remove ${concept}`} />
                  </button>
                ))}
              </span>
            )}
          </label>
          <label className="topic-dialog-field topic-dialog-full">Notes
            <textarea value={draft.notes} onChange={updateField("notes")} rows="5" maxLength="20000" />
          </label>
          <label className="topic-dialog-field topic-dialog-full">Reference links (one per line)
            <textarea value={draft.referenceLinks} onChange={updateField("referenceLinks")} rows="3" placeholder="https://..." />
          </label>
          <label className="topic-dialog-field topic-dialog-full">Design document / diagram link
            <input type="url" value={draft.designLink} onChange={updateField("designLink")} placeholder="https://..." />
          </label>
          <footer className="topic-dialog-footer">
            <button type="button" className="topic-dialog-cancel" onClick={onClose}>Cancel</button>
            <button type="submit" className="topic-dialog-save"><Save size={15} /> Save</button>
          </footer>
        </form>
      </section>
    </div>
  );
}

const makeDesignId = () =>
  globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`;

const formatWeekOf = (value) => {
  const [year, month, day] = value.split("-").map(Number);
  return new Intl.DateTimeFormat(undefined, { day: "numeric", month: "short", year: "numeric" })
    .format(new Date(year, month - 1, day));
};

function DesignImage({ image, onRemove }) {
  const [source, setSource] = useState("");

  useEffect(() => {
    if (!image.blob) return undefined;
    const objectUrl = URL.createObjectURL(image.blob);
    setSource(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [image.blob]);

  return (
    <figure className="weekly-design-image">
      {source
        ? <img src={source} alt={image.name || "Uploaded design reference"} loading="lazy" />
        : <div className="weekly-design-image-placeholder"><ImageIcon size={20} /> Loading image…</div>}
      <figcaption>
        <span title={image.name}>{image.name}</span>
        {onRemove && (
          <button type="button" className="design-image-remove" onClick={onRemove} aria-label={`Remove ${image.name}`}>
            <X size={14} />
          </button>
        )}
      </figcaption>
    </figure>
  );
}

function DesignEditorDialog({ subjectId, subject, design, onClose, onSave }) {
  const [draft, setDraft] = useState(() => ({
    id: design?.id || makeDesignId(),
    subjectId: design?.subjectId || "",
    title: design?.title || "",
    weekOf: design?.weekOf || dateKey(new Date()),
    requirements: design?.requirements || "",
    apiContracts: design?.apiContracts || "",
    architecture: design?.architecture || "",
    databaseSchema: design?.databaseSchema || "",
    bottlenecks: design?.bottlenecks || "",
    tradeoffs: design?.tradeoffs || "",
    diagramLink: design?.diagramLink || "",
    images: Array.isArray(design?.images) ? design.images : [],
  }));
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape" && !saving) onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose, saving]);

  const updateField = (field) => (event) => {
    setDraft((current) => ({ ...current, [field]: event.target.value }));
  };

  const addImages = (event) => {
    const selectedFiles = Array.from(event.target.files || []);
    event.target.value = "";
    if (selectedFiles.some((file) => !file.type.startsWith("image/"))) {
      setError("Choose image files only.");
      return;
    }
    if (selectedFiles.some((file) => file.size > MAX_DESIGN_IMAGE_SIZE)) {
      setError("Each image must be 5 MB or smaller.");
      return;
    }
    if (draft.images.length + selectedFiles.length > MAX_DESIGN_IMAGES) {
      setError(`You can attach up to ${MAX_DESIGN_IMAGES} images to each design.`);
      return;
    }
    const additions = selectedFiles.map((file) => ({
      id: makeDesignId(),
      name: file.name,
      type: file.type,
      blob: file,
    }));
    setDraft((current) => ({ ...current, images: [...current.images, ...additions] }));
    setError("");
  };

  const submit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      await onSave({ ...draft, subjectId, updatedAt: new Date().toISOString() });
      onClose();
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Could not save this design.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="topic-dialog-backdrop design-dialog-backdrop" onMouseDown={(event) => {
      if (event.target === event.currentTarget && !saving) onClose();
    }}>
      <section className="topic-details-dialog design-editor-dialog" role="dialog" aria-modal="true" aria-labelledby="design-dialog-title">
        <form onSubmit={submit}>
          <header className="topic-dialog-header">
            <div><p className="progress-eyebrow">{subject.label}</p><h2 id="design-dialog-title">{design ? "Edit design" : "New design"}</h2></div>
            <button type="button" className="topic-dialog-close" onClick={onClose} disabled={saving} aria-label="Close design form"><X size={17} /></button>
          </header>
          <div className="design-editor-fields">
            <label className="topic-dialog-field">Title
              <input required autoFocus maxLength="120" value={draft.title} onChange={updateField("title")} placeholder="e.g. Design a URL shortener" />
            </label>
            <label className="topic-dialog-field">Week of
              <input required type="date" value={draft.weekOf} onChange={updateField("weekOf")} />
            </label>
            <label className="topic-dialog-field design-field-full">Requirements (functional & non-functional)
              <textarea rows="3" maxLength="10000" value={draft.requirements} onChange={updateField("requirements")} />
            </label>
            <label className="topic-dialog-field design-field-full">API contracts
              <textarea rows="3" maxLength="10000" value={draft.apiContracts} onChange={updateField("apiContracts")} />
            </label>
            <label className="topic-dialog-field design-field-full">Architecture description / diagram (text, ASCII or Mermaid)
              <textarea rows="4" maxLength="20000" value={draft.architecture} onChange={updateField("architecture")} />
            </label>
            <label className="topic-dialog-field design-field-full">Database schema
              <textarea rows="3" maxLength="10000" value={draft.databaseSchema} onChange={updateField("databaseSchema")} />
            </label>
            <label className="topic-dialog-field design-field-full">Bottlenecks
              <textarea rows="3" maxLength="10000" value={draft.bottlenecks} onChange={updateField("bottlenecks")} />
            </label>
            <label className="topic-dialog-field design-field-full">Trade-offs & decisions
              <textarea rows="3" maxLength="10000" value={draft.tradeoffs} onChange={updateField("tradeoffs")} />
            </label>
            <label className="topic-dialog-field design-field-full">Diagram link (image / Excalidraw / Figma)
              <input type="url" value={draft.diagramLink} onChange={updateField("diagramLink")} placeholder="https://..." />
            </label>
            <div className="topic-dialog-field design-field-full">
              <span>Images</span>
              <label className="design-image-picker">
                <Upload size={16} />
                <span>Add images from your device</span>
                <input type="file" accept="image/*" multiple onChange={addImages} />
              </label>
              <small className="design-image-help">Up to {MAX_DESIGN_IMAGES} images per design; each image can be up to 5 MB.</small>
              {draft.images.length > 0 && (
                <div className="weekly-design-image-grid edit-image-grid">
                  {draft.images.map((image) => (
                    <DesignImage
                      key={image.id}
                      image={image}
                      onRemove={() => setDraft((current) => ({ ...current, images: current.images.filter((item) => item.id !== image.id) }))}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
          {error && <p className="design-form-error" role="alert">{error}</p>}
          <footer className="topic-dialog-footer">
            <button type="button" className="topic-dialog-cancel" onClick={onClose} disabled={saving}>Cancel</button>
            <button type="submit" className="topic-dialog-save" disabled={saving}><Save size={15} /> {saving ? "Saving…" : "Save design"}</button>
          </footer>
        </form>
      </section>
    </div>
  );
}

function DesignOfWeek({ subjectId, subject }) {
  const [designs, setDesigns] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingDesign, setEditingDesign] = useState(null);

  useEffect(() => {
    let isActive = true;
    setIsLoading(true);
    setError("");
    getSubjectDesigns(subjectId).then((savedDesigns) => {
      if (isActive) setDesigns(savedDesigns.sort((a, b) => b.weekOf.localeCompare(a.weekOf)));
    }).catch((loadError) => {
      if (isActive) setError(loadError instanceof Error ? loadError.message : "Could not load saved designs.");
    }).finally(() => {
      if (isActive) setIsLoading(false);
    });
    return () => { isActive = false; };
  }, [subjectId]);

  const save = async (design) => {
    await writeDesign(design);
    setDesigns((current) => [design, ...current.filter((item) => item.id !== design.id)]
      .sort((a, b) => b.weekOf.localeCompare(a.weekOf)));
    setError("");
  };

  const deleteDesign = async (design) => {
    if (!window.confirm(`Delete "${design.title}" and its uploaded images?`)) return;
    try {
      await removeDesign(design.id);
      setDesigns((current) => current.filter((item) => item.id !== design.id));
      setError("");
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "Could not delete this design.");
    }
  };

  const designSections = [
    ["Requirements", "requirements"],
    ["API contracts", "apiContracts"],
    ["Architecture description / diagram", "architecture"],
    ["Database schema", "databaseSchema"],
    ["Bottlenecks", "bottlenecks"],
    ["Trade-offs & decisions", "tradeoffs"],
  ];

  return (
    <section className="design-of-week">
      <div className="design-week-toolbar">
        <p>Document one design per week, then revisit and refine it.</p>
        <button type="button" className="topic-dialog-save design-new-button" onClick={() => setEditingDesign({})}>
          <Plus size={16} /> New design
        </button>
      </div>
      {error && <p className="design-form-error" role="alert">{error}</p>}
      {isLoading ? (
        <p className="design-empty-state">Loading saved designs…</p>
      ) : designs.length === 0 ? (
        <div className="design-empty-state"><ImageIcon size={24} /><p>No weekly designs yet. Add your first system design to get started.</p></div>
      ) : (
        <div className="weekly-design-list">
          {designs.map((design) => (
            <article className="weekly-design-card progress-card" key={design.id}>
              <header className="weekly-design-card-header">
                <div><h3>{design.title}</h3><p>Week of {formatWeekOf(design.weekOf)}</p></div>
                <div className="weekly-design-actions">
                  <button type="button" className="study-topic-icon-button" onClick={() => setEditingDesign(design)} aria-label={`Edit ${design.title}`} title="Edit design"><Pencil size={15} /></button>
                  <button type="button" className="study-topic-icon-button remove" onClick={() => deleteDesign(design)} aria-label={`Delete ${design.title}`} title="Delete design"><Trash2 size={15} /></button>
                </div>
              </header>
              <div className="weekly-design-sections">
                {designSections.filter(([, field]) => design[field]?.trim()).map(([label, field]) => (
                  <details className="weekly-design-detail" key={field}>
                    <summary>{label}</summary>
                    <p>{design[field]}</p>
                  </details>
                ))}
              </div>
              {design.images?.length > 0 && (
                <div className="weekly-design-gallery">
                  <h4>Uploaded images</h4>
                  <div className="weekly-design-image-grid">
                    {design.images.map((image) => <DesignImage key={image.id} image={image} />)}
                  </div>
                </div>
              )}
              {design.diagramLink && <a className="weekly-design-link" href={design.diagramLink} target="_blank" rel="noreferrer">Open diagram <ExternalLink size={13} /></a>}
            </article>
          ))}
        </div>
      )}
      {editingDesign && (
        <DesignEditorDialog
          key={editingDesign.id || "new-design"}
          subjectId={subjectId}
          subject={subject}
          design={editingDesign.id ? editingDesign : null}
          onClose={() => setEditingDesign(null)}
          onSave={save}
        />
      )}
    </section>
  );
}

function SubjectTracker({
  subjectId,
  subject,
  topics,
  statuses,
  notes,
  details,
  noteSelection,
  setNoteSelection,
  saveDetails,
  onAddTopic,
  onRenameTopic,
  onRemoveTopic,
}) {
  const [addingTopic, setAddingTopic] = useState(false);
  const [activeView, setActiveView] = useState("roadmap");
  const [newTopic, setNewTopic] = useState("");
  const [topicError, setTopicError] = useState("");
  const [editingTopic, setEditingTopic] = useState("");
  const [topicDraft, setTopicDraft] = useState("");
  const subjectStatuses = Object.fromEntries(
    topics.map((topic) => {
      const savedStatus = statuses[topicKey(subjectId, topic)];
      return [topic, STUDY_STATUSES.includes(savedStatus) ? savedStatus : "Not Started"];
    }),
  );
  const completedCount = Object.values(subjectStatuses).filter((status) => status === "Completed").length;
  const learningCount = Object.values(subjectStatuses).filter((status) => status === "Learning").length;
  const practicedCount = Object.values(subjectStatuses).filter((status) => status === "Practicing").length;
  const percentage = topics.length ? Math.round((completedCount / topics.length) * 100) : 0;
  const statusesByTopic = Object.fromEntries(topics.map((topic) => [topic, subjectStatuses[topic]]));
  const addTopic = (event) => {
    event.preventDefault();
    const trimmedTopic = newTopic.trim();
    if (!trimmedTopic) {
      setTopicError("Enter a topic name.");
      return;
    }
    if (topics.some((topic) => topic.toLocaleLowerCase() === trimmedTopic.toLocaleLowerCase())) {
      setTopicError("That topic already exists in this roadmap.");
      return;
    }
    onAddTopic(subjectId, trimmedTopic);
    setNewTopic("");
    setTopicError("");
    setAddingTopic(false);
  };
  const renameTopic = (event, oldTopic) => {
    event.preventDefault();
    const trimmedTopic = topicDraft.trim();
    if (!trimmedTopic) {
      setTopicError("Enter a topic name.");
      return;
    }
    if (trimmedTopic !== oldTopic && topics.some((topic) => topic.toLocaleLowerCase() === trimmedTopic.toLocaleLowerCase())) {
      setTopicError("That topic already exists in this roadmap.");
      return;
    }
    if (trimmedTopic !== oldTopic) onRenameTopic(subjectId, oldTopic, trimmedTopic);
    setEditingTopic("");
    setTopicDraft("");
    setTopicError("");
  };

  return (
    <>
      <section className="subject-overview progress-card">
        <div className="subject-overview-title">
          <div><p className="progress-eyebrow">STUDY ROADMAP</p><h2>{subject.heading}</h2><p>{subject.description}</p></div>
          <span className="subject-progress-value">{percentage}%<small>complete</small></span>
        </div>
        <div className="subject-overall-track"><span style={{ width: `${percentage}%` }} /></div>
        <div className="subject-overview-stats">
          <span><strong>{topics.length}</strong> roadmap topics</span>
          <span><strong>{completedCount}</strong> completed</span>
          <span><strong>{learningCount + practicedCount}</strong> in progress</span>
        </div>
      </section>

      <div className="study-view-tabs" role="tablist" aria-label={`${subject.label} study views`}>
        <button
          id="roadmap-view-tab"
          type="button"
          role="tab"
          aria-selected={activeView === "roadmap"}
          aria-controls="roadmap-view-panel"
          className={activeView === "roadmap" ? "active" : ""}
          onClick={() => setActiveView("roadmap")}
        >Roadmap & topics</button>
        <button
          id="design-view-tab"
          type="button"
          role="tab"
          aria-selected={activeView === "designs"}
          aria-controls="design-view-panel"
          className={activeView === "designs" ? "active" : ""}
          onClick={() => setActiveView("designs")}
        >Design of the Week</button>
      </div>

      {activeView === "roadmap" ? (
        <div id="roadmap-view-panel" role="tabpanel" aria-labelledby="roadmap-view-tab">
      <div className="progress-metrics-grid subject-metrics-grid">
        <MetricCard label="Topics completed" value={`${completedCount}/${topics.length}`} detail={`${percentage}% complete`} icon={Check} accent="green" />
        <MetricCard label="Currently learning" value={learningCount} detail="Marked as Learning" icon={BookOpen} accent="blue" />
        <MetricCard label="Practicing" value={practicedCount} detail="Marked as Practicing" icon={Activity} accent="amber" />
        <MetricCard label="Notes saved" value={topics.filter((topic) => (notes[topicKey(subjectId, topic)] || "").trim()).length} detail="Saved in this browser" icon={FileText} accent="violet" />
      </div>

      <ProgressCharts topics={topics} statuses={statusesByTopic} />

      <section className="progress-card study-roadmap-card">
        <div className="progress-section-heading">
          <div><p className="progress-eyebrow">Study roadmap</p><h2>Topics & lecture notes</h2></div>
          <div className="study-roadmap-heading-actions">
            <span className="progress-pill">{topics.length} topics</span>
            <button type="button" className="study-add-topic-button" onClick={() => { setAddingTopic((open) => !open); setTopicError(""); }}>
              <Plus size={15} /> Add topic
            </button>
          </div>
        </div>
        {addingTopic && (
          <form className="study-add-topic-form" onSubmit={addTopic}>
            <label className="sr-only" htmlFor="study-new-topic">New topic name</label>
            <input id="study-new-topic" autoFocus value={newTopic} onChange={(event) => { setNewTopic(event.target.value); setTopicError(""); }} placeholder="Enter a topic name" maxLength="120" />
            <button type="submit" className="study-add-topic-button"><Plus size={15} /> Add</button>
            <button type="button" className="study-topic-cancel" onClick={() => { setAddingTopic(false); setTopicError(""); }}>Cancel</button>
          </form>
        )}
        {topicError && <p className="study-topic-error" role="alert">{topicError}</p>}
        <div className="study-topic-list">
          {topics.map((topic, index) => {
            const key = topicKey(subjectId, topic);
            const status = subjectStatuses[topic];
            const topicDetails = details[key] || {};
            const hasDetails = Boolean(
              (notes[key] || "").trim()
              || topicDetails.startedOn
              || topicDetails.lastReviewed
              || topicDetails.nextReview
              || topicDetails.confidence && topicDetails.confidence !== "Not assessed"
              || topicDetails.attempts
              || Array.isArray(topicDetails.concepts) && topicDetails.concepts.length
              || topicDetails.referenceLinks
              || topicDetails.designLink,
            );
            return (
              <article className="study-topic-card" key={topic}>
                <div className="study-topic-number">{String(index + 1).padStart(2, "0")}</div>
                <div className="study-topic-body">
                  <div className="study-topic-title-row">
                    {editingTopic === topic ? (
                      <form className="study-topic-edit-form" onSubmit={(event) => renameTopic(event, topic)}>
                        <label className="sr-only" htmlFor={`study-topic-edit-${index}`}>Edit topic name</label>
                        <input id={`study-topic-edit-${index}`} autoFocus value={topicDraft} onChange={(event) => { setTopicDraft(event.target.value); setTopicError(""); }} maxLength="120" />
                        <button type="submit" className="study-topic-icon-button" aria-label={`Save ${topic} name`}><Check size={15} /></button>
                        <button type="button" className="study-topic-icon-button" aria-label="Cancel topic name edit" onClick={() => { setEditingTopic(""); setTopicError(""); }}><X size={15} /></button>
                      </form>
                    ) : (
                      <div className="study-topic-name">
                        <h3>{topic}</h3>
                        <div className="study-topic-manage">
                          <button type="button" className="study-topic-icon-button" aria-label={`Edit ${topic}`} title="Edit topic" onClick={() => { setEditingTopic(topic); setTopicDraft(topic); setTopicError(""); }}><Pencil size={14} /></button>
                          <button type="button" className="study-topic-icon-button remove" aria-label={`Remove ${topic}`} title="Remove topic" onClick={() => onRemoveTopic(subjectId, topic)}><Trash2 size={14} /></button>
                        </div>
                      </div>
                    )}
                    <button
                      type="button"
                      className={`study-status-control study-status-trigger status-${status.toLowerCase().replace(" ", "-")}`}
                      onClick={() => setNoteSelection(topic)}
                      aria-label={`Edit progress and details for ${topic}. Current status: ${status}`}
                      aria-haspopup="dialog"
                      title="Edit topic progress and details"
                    >{status}<ChevronDown size={13} aria-hidden="true" /></button>
                  </div>
                  <p>{hasDetails ? "Your topic details are saved." : "Record your progress, concepts, and revision notes."}</p>
                  {hasDetails && (
                    <div className="study-topic-summary">
                      {topicDetails.startedOn && <span>Started {topicDetails.startedOn}</span>}
                      {topicDetails.lastReviewed && <span>Reviewed {topicDetails.lastReviewed}</span>}
                      {topicDetails.nextReview && <span>Review due {topicDetails.nextReview}</span>}
                      {topicDetails.confidence && topicDetails.confidence !== "Not assessed" && <span>{topicDetails.confidence} confidence</span>}
                      {topicDetails.attempts > 0 && <span>{topicDetails.attempts} practice attempts</span>}
                      {Array.isArray(topicDetails.concepts) && topicDetails.concepts.length > 0 && <span>{topicDetails.concepts.join(" · ")}</span>}
                      {(notes[key] || "").trim() && <p>{notes[key]}</p>}
                      {topicDetails.referenceLinks?.trim() && <p>References: {topicDetails.referenceLinks}</p>}
                      {topicDetails.designLink && <p>Design: {topicDetails.designLink}</p>}
                    </div>
                  )}
                  <div className="study-topic-actions">
                    <button type="button" className="study-notes-button" onClick={() => setNoteSelection(topic)}><FileText size={15} /> {hasDetails ? "Open details" : "Add details"} <ExternalLink size={12} /></button>
                    {hasDetails && <span className="saved-note-badge"><Check size={12} /> Saved</span>}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>
      <p className="subject-storage-note"><CircleHelp size={14} /> Your topic statuses and notes are saved locally in this browser. Clearing site data will remove them.</p>
        </div>
      ) : (
        <div id="design-view-panel" role="tabpanel" aria-labelledby="design-view-tab">
          <DesignOfWeek subjectId={subjectId} subject={subject} />
        </div>
      )}
      {noteSelection && (
        <TopicDetailsDialog
          key={topicKey(subjectId, noteSelection)}
          subject={subject}
          topic={noteSelection}
          status={subjectStatuses[noteSelection]}
          details={details[topicKey(subjectId, noteSelection)] || {}}
          note={notes[topicKey(subjectId, noteSelection)] || ""}
          onClose={() => setNoteSelection("")}
          onSave={(value) => saveDetails(topicKey(subjectId, noteSelection), value)}
        />
      )}
    </>
  );
}

function DsaTracker({ log, setLog }) {
  const [refreshToken, setRefreshToken] = useState(0);
  const [remoteLoading, setRemoteLoading] = useState(true);
  const [remoteError, setRemoteError] = useState("");
  const [codolioData, setCodolioData] = useState(null);
  const [form, setForm] = useState({ solved: "1", difficulty: "Medium", topic: "" });
  const today = dateKey(new Date());
  const todayCount = log.filter((entry) => entry.date === today).reduce((sum, entry) => sum + entry.solved, 0);
  const manualTotal = log.reduce((sum, entry) => sum + entry.solved, 0);
  const topicCounts = log.reduce((topics, entry) => {
    if (entry.topic) topics[entry.topic] = (topics[entry.topic] || 0) + entry.solved;
    return topics;
  }, {});
  const liveProfiles = codolioData?.platformProfiles?.platformProfiles || [];
  const leetcode = liveProfiles.find((profile) => profile.platform === "leetcode");
  const geeksforgeeks = liveProfiles.find((profile) => profile.platform === "geeksforgeeks");
  const profiles = [
    leetcode && {
      id: "leetcode",
      label: "LeetCode",
      handle: leetcode.userStats?.handle || "DS1B_2201641540078",
      url: `https://leetcode.com/u/${encodeURIComponent(leetcode.userStats?.handle || "DS1B_2201641540078")}/`,
      data: leetcode,
      accent: "leetcode",
    },
    geeksforgeeks && {
      id: "geeksforgeeks",
      label: "GeeksforGeeks",
      handle: geeksforgeeks.userStats?.handle || "2k22psitc7ofz",
      url: `https://www.geeksforgeeks.org/profile/${encodeURIComponent(geeksforgeeks.userStats?.handle || "2k22psitc7ofz")}?tab=activity`,
      data: geeksforgeeks,
      accent: "gfg",
    },
  ].filter(Boolean);
  const platformTotal = profiles.reduce((sum, profile) => sum + (profile.data.totalQuestionStats?.totalQuestionCounts || 0), 0);
  const platformDifficulty = ["easy", "medium", "hard"].map((level) => ({
    label: level.charAt(0).toUpperCase() + level.slice(1),
    value: profiles.reduce((sum, profile) => sum + (profile.data.totalQuestionStats?.[`${level}QuestionCounts`] || 0), 0),
    color: { easy: "#31d49d", medium: "#f3bc4e", hard: "#ef687c" }[level],
  }));
  const combinedActivity = profiles.reduce((counts, profile) => {
    Object.entries(profile.data.dailyActivityStatsResponse?.submissionCalendar || {}).forEach(([timestamp, count]) => {
      const numericTimestamp = Number(timestamp);
      if (!Number.isFinite(numericTimestamp) || !Number.isFinite(count)) return;
      const key = dateKey(new Date(numericTimestamp * 1000));
      counts[key] = (counts[key] || 0) + count;
    });
    return counts;
  }, {});
  const uniqueActiveDays = Object.values(combinedActivity).filter((count) => count > 0).length;
  const leetcodeContests = (leetcode?.contestActivityStats?.contestActivityList || [])
    .filter((contest) => Number.isFinite(contest.rating))
    .map((contest) => ({
      ...contest,
      platform: "leetcode",
      date: contest.contestDate ? new Date(contest.contestDate * 1000) : null,
      name: contest.contestName || "LeetCode contest",
    }))
    .sort((a, b) => a.contestDate - b.contestDate);
  const leetcodeRating = leetcode?.userStats?.currentRating;
  const leetcodeMaxRating = leetcode?.userStats?.maxRating;

  useEffect(() => {
    const controller = new AbortController();
    setRemoteLoading(true);
    setRemoteError("");
    getCodolioJSON(
      `https://api.codolio.com/profile?userKey=${encodeURIComponent(CODOLIO_PROFILE_NAME)}`,
      controller.signal,
    ).then((profile) => {
      if (controller.signal.aborted) return;
      setCodolioData(profile);
      setRemoteLoading(false);
    }).catch((error) => {
      if (controller.signal.aborted) return;
      setRemoteError(error instanceof Error ? error.message : "Could not load the linked coding profiles.");
      setRemoteLoading(false);
    });
    return () => controller.abort();
  }, [refreshToken]);

  const addEntry = (event) => {
    event.preventDefault();
    const solved = Number(form.solved);
    const topic = form.topic.trim();
    if (!Number.isInteger(solved) || solved < 1 || solved > 100) return;
    const entry = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      date: today,
      solved,
      difficulty: form.difficulty,
      topic,
    };
    const updated = [entry, ...log];
    setLog(updated);
    try {
      window.localStorage.setItem(DSA_LOG_KEY, JSON.stringify(updated));
    } catch {
      // The current session still updates if browser storage is unavailable.
    }
    setForm({ solved: "1", difficulty: "Medium", topic: "" });
  };

  const removeEntry = (id) => {
    const updated = log.filter((entry) => entry.id !== id);
    setLog(updated);
    try {
      window.localStorage.setItem(DSA_LOG_KEY, JSON.stringify(updated));
    } catch {
      // The current session still updates if browser storage is unavailable.
    }
  };

  return (
    <>
      <section className="progress-card dsa-live-header">
        <div className="dsa-live-title">
          <div><p className="progress-eyebrow">DSA PROFILE TRACKER</p><h2>Problem-solving stats</h2><p>Live public profile data from your connected LeetCode and GeeksforGeeks accounts.</p></div>
          <div className="dsa-live-actions">
            <span className="dsa-sync-label"><i className={`sync-indicator ${remoteLoading ? "syncing" : remoteError ? "failed" : "synced"}`} />{remoteLoading ? "Syncing…" : remoteError ? "Sync failed" : `Synced ${new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`}</span>
            <button type="button" className="icon-button" onClick={() => setRefreshToken((token) => token + 1)} disabled={remoteLoading} aria-label="Refresh DSA profile stats"><RefreshCw size={16} className={remoteLoading ? "spin-icon" : ""} /></button>
          </div>
        </div>
        <div className="dsa-connected-profiles">
          <a href="https://leetcode.com/u/DS1B_2201641540078/" target="_blank" rel="noreferrer"><span className="dsa-platform-icon leetcode">L</span><span><strong>LeetCode</strong><small>DS1B_2201641540078</small></span><ExternalLink size={15} /></a>
          <a href="https://www.geeksforgeeks.org/profile/2k22psitc7ofz?tab=activity" target="_blank" rel="noreferrer"><span className="dsa-platform-icon gfg">G</span><span><strong>GeeksforGeeks</strong><small>2k22psitc7ofz</small></span><ExternalLink size={15} /></a>
          <a className="dsa-provider-link" href={CODOLIO_PROFILE_URL} target="_blank" rel="noreferrer">Stats provided by Codolio <ExternalLink size={13} /></a>
        </div>
      </section>

      {remoteError && (
        <div className="progress-error dsa-sync-error" role="alert">
          Could not sync platform stats: {remoteError}
          <button type="button" onClick={() => setRefreshToken((token) => token + 1)}>Retry</button>
          <a href={CODOLIO_PROFILE_URL} target="_blank" rel="noreferrer">Open Codolio profile <ExternalLink size={13} /></a>
        </div>
      )}
      {remoteLoading && !codolioData && <div className="progress-card coding-loading-card"><span className="sync-indicator syncing" /> Loading your connected platform stats…</div>}

      <div className="progress-metrics-grid dsa-live-metrics">
        <MetricCard label="Problems solved" value={remoteLoading && !codolioData ? "—" : platformTotal.toLocaleString()} detail="LeetCode + GeeksforGeeks" icon={Check} accent="violet" />
        <MetricCard label="LeetCode contest rating" value={Number.isFinite(leetcodeRating) ? leetcodeRating.toLocaleString() : "—"} detail={Number.isFinite(leetcodeMaxRating) ? `Peak rating ${leetcodeMaxRating.toLocaleString()}` : "Not reported"} icon={Activity} accent="amber" />
        <MetricCard label="Active days" value={uniqueActiveDays.toLocaleString()} detail="Unique days across both platforms" icon={Code2} accent="green" />
        <MetricCard label="Practice sessions" value={log.length} detail={`${manualTotal.toLocaleString()} manually logged · separate from sync`} icon={BookOpen} accent="blue" />
      </div>

      <section className="progress-card dsa-solved-summary">
        <div className="progress-section-heading"><div><p className="progress-eyebrow">Sum of the two linked profiles</p><h2>{platformTotal.toLocaleString()} platform-reported solved problems</h2></div><span className="progress-pill">Both accounts</span></div>
        <div className="dsa-platform-breakdown">
          {profiles.map((profile) => {
            const counts = profile.data.totalQuestionStats || {};
            return (
              <article className="dsa-platform-summary" key={profile.id}>
                <div className="dsa-platform-summary-title"><span className={`dsa-platform-icon ${profile.accent}`}>{profile.id === "leetcode" ? "L" : "G"}</span><div><h3>{profile.label}</h3><span>{Number(counts.totalQuestionCounts || 0).toLocaleString()} solved</span></div><a href={profile.url} target="_blank" rel="noreferrer" aria-label={`Open ${profile.label} profile`}><ExternalLink size={15} /></a></div>
                <div className="dsa-platform-difficulties">
                  {["Easy", "Medium", "Hard"].map((difficulty) => <span key={difficulty}><small>{difficulty}</small><strong>{Number(counts[`${difficulty.toLowerCase()}QuestionCounts`] || 0).toLocaleString()}</strong></span>)}
                </div>
                {profile.id === "geeksforgeeks" && <p className="dsa-gfg-categories">{Number(counts.basicQuestionCounts || 0)} Basic · {Number(counts.schoolQuestionCounts || 0)} School</p>}
              </article>
            );
          })}
          {!profiles.length && !remoteLoading && <p className="progress-empty">Codolio did not return these platform profiles.</p>}
        </div>
        <p className="progress-note"><CircleHelp size={14} /> This is the sum reported by the two platforms. The same question solved on both platforms can be counted twice.</p>
      </section>

      <div className="progress-content-grid dsa-analytics-grid">
        <CodingDonut title="Solved by difficulty" items={platformDifficulty} note="Sum of LeetCode and GeeksforGeeks difficulty counts. It may include the same question solved on both platforms." />
        <section className="progress-card dsa-contest-card">
          <div className="progress-section-heading"><div><p className="progress-eyebrow">LeetCode · live profile stats</p><h2>Contest performance</h2></div><a className="dsa-contest-link" href="https://leetcode.com/u/DS1B_2201641540078/" target="_blank" rel="noreferrer">LeetCode <ExternalLink size={13} /></a></div>
          <div className="dsa-contest-overview">
            <div><span>Current rating</span><strong>{Number.isFinite(leetcodeRating) ? leetcodeRating.toLocaleString() : "—"}</strong></div>
            <div><span>Peak rating</span><strong>{Number.isFinite(leetcodeMaxRating) ? leetcodeMaxRating.toLocaleString() : "—"}</strong></div>
            <div><span>Contest records</span><strong>{leetcodeContests.length}</strong></div>
          </div>
          <ContestRatingChart contests={leetcodeContests} />
          {leetcodeContests.length > 0 && <p className="dsa-latest-contest">{leetcodeContests[leetcodeContests.length - 1].name}{Number.isFinite(leetcodeContests[leetcodeContests.length - 1].rank) ? ` · Rank ${leetcodeContests[leetcodeContests.length - 1].rank.toLocaleString()}` : ""}</p>}
        </section>
      </div>

      <Heatmap counts={combinedActivity} title="LeetCode + GeeksforGeeks submissions" totalLabel="submissions" year="Activity from connected profiles" />

      <div className="progress-content-grid dsa-detail-grid">
        {profiles.map((profile) => {
          const topics = Object.entries(profile.data.topicAnalysisStats?.topicWiseDistribution || {})
            .filter(([, count]) => Number.isFinite(count) && count > 0)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 8);
          const activityStats = profile.data.dailyActivityStatsResponse || {};
          return (
            <section className="progress-card dsa-platform-detail" key={`${profile.id}-detail`}>
              <div className="progress-section-heading"><div><p className="progress-eyebrow">{profile.label} · {profile.handle}</p><h2>Platform details</h2></div><a href={profile.url} target="_blank" rel="noreferrer" aria-label={`Open ${profile.label} profile`}><ExternalLink size={16} /></a></div>
              <div className="dsa-detail-stats">
                <span><small>Questions solved</small><strong>{Number(profile.data.totalQuestionStats?.totalQuestionCounts || 0).toLocaleString()}</strong></span>
                <span><small>Max reported streak</small><strong>{Number(activityStats.maxStreak || 0)} days</strong></span>
                {Number.isFinite(activityStats.totalActiveDays) && <span><small>Reported active days</small><strong>{activityStats.totalActiveDays}</strong></span>}
              </div>
              <div className="dsa-difficulty-bars">
                {platformDifficulty.map((difficulty) => {
                  const count = Number(profile.data.totalQuestionStats?.[`${difficulty.label.toLowerCase()}QuestionCounts`] || 0);
                  const max = Math.max(...["easy", "medium", "hard"].map((level) => Number(profile.data.totalQuestionStats?.[`${level}QuestionCounts`] || 0)), 1);
                  return <div className="difficulty-row" key={difficulty.label}><div><span>{difficulty.label}</span><strong>{count.toLocaleString()}</strong></div><div className="difficulty-track"><span className={`difficulty-fill ${difficulty.label.toLowerCase()}`} style={{ width: `${(count / max) * 100}%` }} /></div></div>;
                })}
              </div>
              <div className="dsa-topic-breakdown">
                <h3>Most practiced topics</h3>
                {topics.length ? topics.map(([topic, count]) => <div className="coding-topic-row" key={topic}><span>{topic}</span><div><i style={{ width: `${Math.max(4, (count / topics[0][1]) * 100)}%` }} /></div><strong>{count.toLocaleString()}</strong></div>) : <p className="progress-empty">Topic details are unavailable for this profile.</p>}
              </div>
              {profile.id === "leetcode" && profile.data.badgeStats?.badgeList?.length > 0 && (
                <div className="dsa-badges">
                  <h3>LeetCode badges</h3>
                  <div>{profile.data.badgeStats.badgeList.slice(0, 5).map((badge) => <span key={badge.displayName || badge.name} title={badge.displayName || badge.name}>{badge.icon ? <img src={badge.icon} alt="" /> : <Star size={18} />}<small>{badge.displayName || badge.name}</small></span>)}</div>
                </div>
              )}
              <p className="progress-note"><CircleHelp size={14} /> Profile data was fetched from Codolio and may follow its platform sync schedule.</p>
            </section>
          );
        })}
      </div>

      <div className="progress-content-grid">
        <section className="progress-card progress-daily-card">
          <div className="progress-section-heading">
            <div><p className="progress-eyebrow">Personal notes</p><h2>Log today&apos;s practice</h2></div>
            <span className="progress-pill">{new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(new Date())}</span>
          </div>
          <form className="dsa-log-form" onSubmit={addEntry}>
            <label>
              Problems solved
              <input type="number" min="1" max="100" step="1" value={form.solved} onChange={(event) => setForm({ ...form, solved: event.target.value })} required />
            </label>
            <label>
              Difficulty
              <select value={form.difficulty} onChange={(event) => setForm({ ...form, difficulty: event.target.value })}>
                {["Easy", "Medium", "Hard"].map((level) => <option key={level}>{level}</option>)}
              </select>
            </label>
            <label className="dsa-topic-field">
              Topic (optional)
              <input maxLength="40" placeholder="e.g. Sliding window" value={form.topic} onChange={(event) => setForm({ ...form, topic: event.target.value })} />
            </label>
            <button type="submit" className="progress-primary-button"><Check size={16} /> Save session</button>
          </form>
        </section>

        <section className="progress-card dsa-manual-card">
          <div className="progress-section-heading"><div><p className="progress-eyebrow">Browser-only journal</p><h2>Manual sessions</h2></div><span className="progress-pill">{manualTotal} logged</span></div>
          <p className="progress-note">Manual entries are kept separate from synced platform counts, so they are not included in the {platformTotal} platform-reported total.</p>
          <div className="dsa-manual-stats"><span>Solved today<strong>{todayCount}</strong></span><span>Topics practiced<strong>{Object.keys(topicCounts).length}</strong></span><span>Saved sessions<strong>{log.length}</strong></span></div>
        </section>
      </div>

      <div className="progress-content-grid">
        <section className="progress-card">
          <div className="progress-section-heading"><div><p className="progress-eyebrow">Based on your logs</p><h2>Topics practiced</h2></div></div>
          {Object.keys(topicCounts).length ? (
            <div className="topic-chips">
              {Object.entries(topicCounts).sort((a, b) => b[1] - a[1]).map(([topic, count]) => <span key={topic}>{topic}<strong>{count}</strong></span>)}
            </div>
          ) : <p className="progress-empty">Add a topic when you log a session to build your topic history.</p>}
        </section>
        <section className="progress-card">
          <div className="progress-section-heading"><div><p className="progress-eyebrow">Recent activity</p><h2>Practice history</h2></div></div>
          {log.length ? (
            <ul className="progress-activity-list">
              {log.slice(0, 5).map((entry) => (
                <li key={entry.id}>
                  <span className="activity-dot" />
                  <div><strong>{entry.solved} {entry.solved === 1 ? "problem" : "problems"} · {entry.difficulty}</strong><span>{entry.topic || "Topic not specified"} · {formatDate(`${entry.date}T12:00:00`)}</span></div>
                  <button type="button" className="progress-remove-button" onClick={() => removeEntry(entry.id)} aria-label="Delete practice entry">×</button>
                </li>
              ))}
            </ul>
          ) : <p className="progress-empty">Your saved practice sessions will appear here.</p>}
        </section>
      </div>
      <p className="progress-data-caveat"><CircleHelp size={14} /> Live stats are fetched from the public Codolio profile endpoint and can be refreshed. Codolio&apos;s own sync frequency determines how current its linked-platform records are.</p>
    </>
  );
}

function GitHubTracker({ username, onUsernameChange }) {
  const [input, setInput] = useState(username);
  const [refreshCount, setRefreshCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [data, setData] = useState({ user: null, repos: null, events: null, syncedAt: null, failures: [] });

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError("");
    const requests = [
      getJSON(`https://api.github.com/users/${encodeURIComponent(username)}`, controller.signal),
      getJSON(`https://api.github.com/users/${encodeURIComponent(username)}/repos?sort=updated&per_page=100`, controller.signal),
      getJSON(`https://api.github.com/users/${encodeURIComponent(username)}/events/public?per_page=100`, controller.signal),
    ];

    Promise.allSettled(requests).then((results) => {
      if (controller.signal.aborted) return;
      const [userResult, reposResult, eventsResult] = results;
      const user = userResult.status === "fulfilled" ? userResult.value : null;
      const repos = reposResult.status === "fulfilled" ? reposResult.value : null;
      const events = eventsResult.status === "fulfilled" ? eventsResult.value : null;
      const failures = results.flatMap((result, index) =>
        result.status === "rejected"
          ? [["profile", "repositories", "public events"][index]]
          : [],
      );
      if (!user && !repos && !events) {
        setError(userResult.status === "rejected" ? userResult.reason.message : "GitHub data could not be loaded.");
      }
      setData({ user, repos, events, syncedAt: new Date(), failures });
      setLoading(false);
    });

    return () => controller.abort();
  }, [username, refreshCount]);

  const eventCounts = useMemo(() => {
    const counts = {};
    (data.events || []).forEach((event) => {
      const key = dateKey(event.created_at);
      counts[key] = (counts[key] || 0) + 1;
    });
    return counts;
  }, [data.events]);

  const recentEvents = (data.events || []).slice(0, 6);
  const stars = (data.repos || []).reduce((sum, repo) => sum + repo.stargazers_count, 0);
  const forks = (data.repos || []).reduce((sum, repo) => sum + repo.forks_count, 0);
  const languages = (data.repos || []).reduce((result, repo) => {
    if (repo.language) result[repo.language] = (result[repo.language] || 0) + 1;
    return result;
  }, {});
  const eventLabel = (event) => ({
    PushEvent: "Pushed commits to",
    PullRequestEvent: "Updated a pull request in",
    IssuesEvent: "Worked on an issue in",
    CreateEvent: "Created a branch or repository in",
    WatchEvent: "Starred",
    ForkEvent: "Forked",
    ReleaseEvent: "Published a release in",
  })[event.type] || `${event.type.replace("Event", "")} in`;

  const saveUsername = (event) => {
    event.preventDefault();
    const clean = input.trim();
    if (!/^[A-Za-z0-9-]{1,39}$/.test(clean)) return;
    onUsernameChange(clean);
  };

  return (
    <>
      <section className="progress-card github-settings-card">
        <form onSubmit={saveUsername} className="github-username-form">
          <label htmlFor="github-username">GitHub username</label>
          <div><span>github.com/</span><input id="github-username" value={input} onChange={(event) => setInput(event.target.value)} maxLength="39" /><button type="submit" className="progress-secondary-button">Update</button></div>
        </form>
        <div className="github-sync-status">
          <span className={`sync-indicator ${loading ? "syncing" : error ? "failed" : "synced"}`} />
          {loading ? "Syncing public data…" : error ? "Sync failed" : data.syncedAt ? `Public API · synced ${data.syncedAt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}` : "Waiting to sync"}
          <button type="button" className="icon-button" onClick={() => setRefreshCount((count) => count + 1)} disabled={loading} aria-label="Refresh GitHub data"><RefreshCw size={16} className={loading ? "spin-icon" : ""} /></button>
        </div>
      </section>
      {error && <div className="progress-error" role="alert">{error} <button type="button" onClick={() => setRefreshCount((count) => count + 1)}>Retry</button></div>}
      {data.failures.length > 0 && !error && <div className="progress-warning" role="status">Some GitHub data is unavailable ({data.failures.join(", ")}). Other sections are still shown.</div>}

      {data.user && (
        <section className="github-profile-banner">
          <div className="github-profile-info">
            <img src={data.user.avatar_url} alt="" />
            <div><p className="progress-eyebrow">GitHub public profile</p><h2>{data.user.name || data.user.login}</h2><a href={data.user.html_url} target="_blank" rel="noreferrer">@{data.user.login} <ExternalLink size={13} /></a></div>
          </div>
          <p>{data.user.bio || "Public profile and repository activity from GitHub."}</p>
        </section>
      )}

      <div className="progress-metrics-grid">
        <MetricCard label="Public repositories" value={data.user ? data.user.public_repos.toLocaleString() : "—"} detail="As reported by GitHub" icon={GitBranch} accent="blue" />
        <MetricCard label="Stars received" value={data.repos ? stars.toLocaleString() : "—"} detail="Across up to 100 public repos" icon={Star} accent="amber" />
        <MetricCard label="Followers" value={data.user ? data.user.followers.toLocaleString() : "—"} detail="Public profile" icon={Users} accent="green" />
        <MetricCard label="Visible public events" value={data.events ? data.events.length.toLocaleString() : "—"} detail="Recent events returned by GitHub" icon={Activity} accent="violet" />
      </div>

      <Heatmap counts={eventCounts} title="GitHub public events" totalLabel="public events" year="Recent activity" />
      <p className="progress-data-caveat"><CircleHelp size={14} /> GitHub&apos;s public events feed is limited and is not a complete contribution calendar. These counts reflect only events returned by the API, not all commits or private activity.</p>

      <div className="progress-content-grid">
        <section className="progress-card">
          <div className="progress-section-heading"><div><p className="progress-eyebrow">Recent updates</p><h2>Repositories</h2></div>{data.repos && <span className="progress-pill">{data.repos.length} fetched</span>}</div>
          {data.repos?.length ? (
            <ul className="progress-repo-list">
              {data.repos.slice(0, 6).map((repo) => (
                <li key={repo.id}><div><a href={repo.html_url} target="_blank" rel="noreferrer">{repo.name} <ExternalLink size={12} /></a><span>{repo.description || "No description provided"}</span></div><div className="repo-meta">{repo.language && <span>{repo.language}</span>}<span><Star size={13} />{repo.stargazers_count}</span><span>{formatDate(repo.updated_at)}</span></div></li>
              ))}
            </ul>
          ) : <p className="progress-empty">{loading ? "Loading repositories…" : "No public repositories found."}</p>}
          <p className="progress-note"><GitBranch size={14} /> Repository list is limited to the 100 most recently updated public repositories.</p>
        </section>
        <section className="progress-card">
          <div className="progress-section-heading"><div><p className="progress-eyebrow">From fetched repositories</p><h2>Primary languages</h2></div></div>
          {Object.keys(languages).length ? <div className="language-list">{Object.entries(languages).sort((a, b) => b[1] - a[1]).slice(0, 6).map(([language, count]) => <div key={language}><span>{language}</span><strong>{count} repos</strong></div>)}</div> : <p className="progress-empty">{loading ? "Loading language data…" : "No language data available."}</p>}
          <p className="progress-note"><CircleHelp size={14} /> Each repository&apos;s primary language; not a skill-level measurement.</p>
          <div className="github-extra-stats"><span><GitPullRequest size={15} /> Forks across fetched repos <strong>{data.repos ? forks : "—"}</strong></span></div>
        </section>
      </div>

      <section className="progress-card github-events-card">
        <div className="progress-section-heading"><div><p className="progress-eyebrow">Public activity feed</p><h2>Recent events</h2></div></div>
        {recentEvents.length ? <ul className="progress-activity-list">{recentEvents.map((event) => <li key={event.id}><span className="activity-dot" /><div><strong>{eventLabel(event)} <a href={`https://github.com/${event.repo.name}`} target="_blank" rel="noreferrer">{event.repo.name}</a></strong><span>{formatDate(event.created_at)} · {event.type.replace("Event", "")}</span></div></li>)}</ul> : <p className="progress-empty">{loading ? "Loading public events…" : "No recent public events are available for this account."}</p>}
      </section>
    </>
  );
}

const getCodolioJSON = async (url, signal) => {
  const response = await fetch(url, { signal, headers: { Accept: "application/json" } });
  if (!response.ok) throw new Error(`Codolio returned ${response.status}. Please retry.`);
  const payload = await response.json();
  if (!payload?.status?.success || !payload.data) {
    throw new Error(payload?.status?.message || "Codolio did not return public profile data.");
  }
  return payload.data;
};

function CodingDonut({ title, items, note }) {
  const validItems = items.filter((item) => Number.isFinite(item.value) && item.value > 0);
  const total = validItems.reduce((sum, item) => sum + item.value, 0);
  const gradient = validItems.reduce((result, item, index) => {
    const start = index === 0 ? 0 : result.end;
    const end = start + (item.value / (total || 1)) * 100;
    result.stops.push(`${item.color} ${start}% ${end}%`);
    result.end = end;
    return result;
  }, { end: 0, stops: [] }).stops.join(", ");

  return (
    <section className="progress-card coding-chart-card">
      <div className="progress-section-heading"><div><p className="progress-eyebrow">From synced profiles</p><h2>{title}</h2></div></div>
      {total ? (
        <div className="coding-donut-layout">
          <div className="coding-donut" style={{ background: `conic-gradient(${gradient})` }} role="img" aria-label={`${title}: ${total} total`}>
            <span><strong>{total.toLocaleString()}</strong><small>Total</small></span>
          </div>
          <div className="coding-donut-legend">
            {validItems.map((item) => (
              <div key={item.label}><span><i style={{ background: item.color }} />{item.label}</span><strong>{item.value.toLocaleString()}</strong></div>
            ))}
          </div>
        </div>
      ) : <p className="progress-empty">No public breakdown is available for this section.</p>}
      {note && <p className="progress-note"><CircleHelp size={14} /> {note}</p>}
    </section>
  );
}

function ContestRatingChart({ contests }) {
  const data = contests.filter((entry) => Number.isFinite(entry.rating)).slice(-10);
  if (!data.length) {
    return <p className="progress-empty">No public contest rating history is available.</p>;
  }
  const ratings = data.map((entry) => entry.rating);
  const min = Math.min(...ratings);
  const max = Math.max(...ratings);
  const range = Math.max(max - min, 1);
  const points = data.map((entry, index) => ({
    ...entry,
    x: data.length === 1 ? 50 : 8 + (index / (data.length - 1)) * 84,
    y: 82 - ((entry.rating - min) / range) * 64,
  }));

  return (
    <div className="coding-rating-chart">
      <svg viewBox="0 0 100 100" role="img" aria-label={`Rating progression from ${data[0].rating} to ${data[data.length - 1].rating}`}>
        <defs><linearGradient id="rating-area-fill" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#67a0ff" stopOpacity=".3" /><stop offset="100%" stopColor="#67a0ff" stopOpacity="0" /></linearGradient></defs>
        {[25, 50, 75].map((y) => <line key={y} x1="5" x2="95" y1={y} y2={y} className="rating-gridline" />)}
        <polygon points={`8,90 ${points.map((point) => `${point.x},${point.y}`).join(" ")} 92,90`} fill="url(#rating-area-fill)" />
        <polyline points={points.map((point) => `${point.x},${point.y}`).join(" ")} className="rating-line" />
        {points.map((point) => <circle key={`${point.platform}-${point.name}-${point.date}`} cx={point.x} cy={point.y} r="1.6" className="rating-point"><title>{point.platform} · {point.name}: {point.rating}</title></circle>)}
      </svg>
      <div className="rating-axis"><span>{min}</span><span>{data[data.length - 1].name}</span><span>{max}</span></div>
    </div>
  );
}

function CodingJourney() {
  const [refreshToken, setRefreshToken] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [data, setData] = useState({ profile: null, github: null, syncedAt: null, githubError: "" });

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError("");
    Promise.allSettled([
      getCodolioJSON(`https://api.codolio.com/profile?userKey=${encodeURIComponent(CODOLIO_PROFILE_NAME)}`, controller.signal),
      getCodolioJSON(`https://api.codolio.com/github/profile?userKey=${encodeURIComponent(CODOLIO_PROFILE_NAME)}`, controller.signal),
    ]).then(([profileResult, githubResult]) => {
      if (controller.signal.aborted) return;
      if (profileResult.status === "rejected") {
        setError(profileResult.reason instanceof Error ? profileResult.reason.message : "Could not load the Codolio profile.");
        setLoading(false);
        return;
      }
      setData({
        profile: profileResult.value,
        github: githubResult.status === "fulfilled" ? githubResult.value : null,
        syncedAt: new Date(),
        githubError: githubResult.status === "rejected" ? "GitHub activity is temporarily unavailable." : "",
      });
      setLoading(false);
    });
    return () => controller.abort();
  }, [refreshToken]);

  const dashboard = useMemo(() => {
    const profile = data.profile;
    if (!profile) return null;
    const platformEntries = Array.isArray(profile.platformProfiles?.platformProfiles)
      ? profile.platformProfiles.platformProfiles
      : [];
    const profileDetails = profile.userDetails?.userPersonalDetails || {};
    const byPlatform = Object.fromEntries(platformEntries.map((entry) => [entry.platform, entry]));
    const questionTotal = (field) => platformEntries.reduce((sum, entry) => {
      const value = entry.totalQuestionStats?.[field];
      return sum + (Number.isFinite(value) ? value : 0);
    }, 0);
    const activity = {};
    platformEntries.forEach((entry) => {
      const calendar = entry.dailyActivityStatsResponse?.submissionCalendar || {};
      Object.entries(calendar).forEach(([timestamp, count]) => {
        const numericTimestamp = Number(timestamp);
        if (!Number.isFinite(numericTimestamp) || !Number.isFinite(count)) return;
        const key = dateKey(new Date(numericTimestamp * 1000));
        activity[key] = (activity[key] || 0) + count;
      });
    });
    const activeDays = Object.values(activity).filter((count) => count > 0).length;
    const year = new Date().getFullYear();
    const yearSubmissions = Object.entries(activity).reduce((sum, [day, count]) => sum + (day.startsWith(`${year}-`) ? count : 0), 0);
    const maxStreak = Math.max(0, ...platformEntries.map((entry) => entry.dailyActivityStatsResponse?.maxStreak || 0));
    const contestEntries = platformEntries.flatMap((entry) =>
      (entry.contestActivityStats?.contestActivityList || [])
        .filter((contest) => Number.isFinite(contest.rating))
        .map((contest) => ({
          ...contest,
          platform: entry.platform,
          date: contest.contestDate ? new Date(contest.contestDate * 1000) : null,
          name: contest.contestName || "Contest",
        })),
    ).sort((a, b) => (a.contestDate || 0) - (b.contestDate || 0));
    const topicCounts = {};
    platformEntries.forEach((entry) => {
      const topicDistribution = entry.topicAnalysisStats?.topicWiseDistribution || {};
      Object.entries(topicDistribution).forEach(([topic, count]) => {
        if (Number.isFinite(count) && count > 0) topicCounts[topic] = (topicCounts[topic] || 0) + count;
      });
    });
    const ratings = ["leetcode", "codechef"].map((platform) => {
      const entry = byPlatform[platform];
      return entry ? {
        platform,
        rating: entry.userStats?.currentRating,
        maxRating: entry.userStats?.maxRating,
        handle: entry.userStats?.handle,
      } : null;
    }).filter(Boolean);
    const platformUrls = {
      leetcode: (handle) => `https://leetcode.com/u/${encodeURIComponent(handle)}/`,
      geeksforgeeks: (handle) => `https://www.geeksforgeeks.org/profile/${encodeURIComponent(handle)}`,
      hackerrank: (handle) => `https://www.hackerrank.com/profile/${encodeURIComponent(handle)}`,
      codeforces: (handle) => `https://codeforces.com/profile/${encodeURIComponent(handle)}`,
      codechef: (handle) => `https://www.codechef.com/users/${encodeURIComponent(handle)}`,
      interviewbit: (handle) => `https://www.interviewbit.com/profile/${encodeURIComponent(handle)}`,
    };
    const platforms = platformEntries.map((entry) => ({
      ...entry,
      handle: entry.userStats?.handle,
      url: platformUrls[entry.platform]?.(entry.userStats?.handle),
      questions: entry.totalQuestionStats?.totalQuestionCounts,
    })).filter((entry) => entry.handle);
    return {
      profileDetails,
      imageUrl: profile.imageUrl,
      displayName: [profile.firstName, profile.secondName].filter(Boolean).join(" ") || profile.profileName,
      profileName: profile.profileName,
      profileViews: profile.profileViews,
      platforms,
      totalQuestions: questionTotal("totalQuestionCounts"),
      easy: questionTotal("easyQuestionCounts"),
      medium: questionTotal("mediumQuestionCounts"),
      hard: questionTotal("hardQuestionCounts"),
      activeDays,
      yearSubmissions,
      totalSubmissions: Object.values(activity).reduce((sum, count) => sum + count, 0),
      maxStreak,
      activity,
      contestEntries,
      ratings,
      topics: Object.entries(topicCounts).sort((a, b) => b[1] - a[1]).slice(0, 8),
      fundamentals: ["basicQuestionCounts", "schoolQuestionCounts"].map((field, index) => ({
        label: index === 0 ? "GFG Basic" : "GFG School",
        value: byPlatform.geeksforgeeks?.totalQuestionStats?.[field] || 0,
      })),
      githubProfile: profile.userDetails?.githubProfile,
    };
  }, [data.profile]);

  const refresh = () => setRefreshToken((token) => token + 1);

  return (
    <div className="coding-journey">
      <div className="coding-journey-heading">
        <div><p className="progress-eyebrow">CODING ANALYTICS</p><h2>Coding Journey</h2><p>Problem-solving progress and contest activity across your connected profiles.</p></div>
      </div>
      <div className="coding-journey-toolbar">
        <div><span className={`sync-indicator ${loading ? "syncing" : error ? "failed" : "synced"}`} />{loading ? "Syncing your public coding profiles…" : error ? "Sync unavailable" : `Codolio public data · synced ${data.syncedAt?.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`}</div>
        <div className="coding-toolbar-actions">
          <a href={CODOLIO_PROFILE_URL} target="_blank" rel="noreferrer">Open Codolio profile <ExternalLink size={14} /></a>
          <button type="button" className="icon-button" onClick={refresh} disabled={loading} aria-label="Refresh Codolio data"><RefreshCw size={16} className={loading ? "spin-icon" : ""} /></button>
        </div>
      </div>

      {error && (
        <section className="progress-card coding-error-card" role="alert">
          <CircleHelp size={21} /><div><strong>Could not sync Codolio stats</strong><p>{error} The original profile is still available.</p></div>
          <button type="button" className="progress-secondary-button" onClick={refresh}>Retry</button>
        </section>
      )}

      {loading && !dashboard && <section className="progress-card coding-loading-card"><span className="sync-indicator syncing" /> Loading public profile statistics…</section>}

      {dashboard && (
        <div className="coding-dashboard-grid">
          <aside className="progress-card coding-profile-card">
            {dashboard.imageUrl ? <img className="coding-profile-avatar" src={dashboard.imageUrl} alt={`${dashboard.displayName} profile`} /> : <div className="coding-profile-avatar coding-avatar-placeholder">{dashboard.displayName?.slice(0, 1) || "C"}</div>}
            <h2>{dashboard.displayName}</h2>
            <a className="coding-profile-handle" href={CODOLIO_PROFILE_URL} target="_blank" rel="noreferrer">@{dashboard.profileName} <ExternalLink size={13} /></a>
            <p className="coding-profile-bio">{dashboard.profileDetails.bio || "Coding profile and problem-solving activity."}</p>
            <div className="coding-profile-meta">
              {dashboard.profileDetails.country && <span><Users size={14} />{dashboard.profileDetails.country}</span>}
              {dashboard.profileDetails.collegeDetails?.collegeName && <span><BookOpen size={14} />{dashboard.profileDetails.collegeDetails.collegeName}</span>}
            </div>
            <div className="coding-profile-divider" />
            <p className="progress-eyebrow">Connected coding profiles</p>
            <ul className="coding-platform-list">
              {dashboard.platforms.map((platform) => (
                <li key={platform.platform}>
                  <span className={`coding-platform-mark ${platform.platform}`}>{platform.platform.slice(0, 1).toUpperCase()}</span>
                  <span className="coding-platform-name">{platform.platform === "geeksforgeeks" ? "GeeksforGeeks" : platform.platform.charAt(0).toUpperCase() + platform.platform.slice(1)}</span>
                  <span className="coding-platform-question">{Number.isFinite(platform.questions) ? platform.questions : "—"}</span>
                  {platform.url && <a href={platform.url} target="_blank" rel="noreferrer" aria-label={`Open ${platform.platform} profile`}><ExternalLink size={14} /></a>}
                </li>
              ))}
              {dashboard.githubProfile && <li><span className="coding-platform-mark github">G</span><span className="coding-platform-name">GitHub</span><span className="coding-platform-question">{data.github?.totalContributions ?? "—"}</span><a href={`https://github.com/${encodeURIComponent(dashboard.githubProfile)}`} target="_blank" rel="noreferrer" aria-label="Open GitHub profile"><ExternalLink size={14} /></a></li>}
            </ul>
            <a className="coding-profile-button" href={CODOLIO_PROFILE_URL} target="_blank" rel="noreferrer">View full Codolio profile <ExternalLink size={14} /></a>
          </aside>

          <div className="coding-dashboard-main">
            <div className="coding-stat-grid">
              <MetricCard label="Questions solved" value={dashboard.totalQuestions.toLocaleString()} detail="Across connected platforms" icon={Check} accent="blue" />
              <MetricCard label="Active days" value={dashboard.activeDays.toLocaleString()} detail="Days with recorded submissions" icon={Activity} accent="green" />
              <MetricCard label="Submissions this year" value={dashboard.yearSubmissions.toLocaleString()} detail={`${new Date().getFullYear()} · platform calendar data`} icon={Code2} accent="violet" />
              <MetricCard label="Longest streak" value={`${dashboard.maxStreak} days`} detail="Best streak reported by platforms" icon={Activity} accent="amber" />
            </div>

            <Heatmap counts={dashboard.activity} title="Codolio platform submissions" totalLabel="submissions" year={`${new Date().getFullYear()} · ${dashboard.totalSubmissions.toLocaleString()} recorded submissions`} />

            <div className="coding-analytics-grid">
              <div className="coding-analytics-primary">
                <CodingDonut
                  title="DSA question distribution"
                  items={[
                    { label: "Easy", value: dashboard.easy, color: "#31d49d" },
                    { label: "Medium", value: dashboard.medium, color: "#f3bc4e" },
                    { label: "Hard", value: dashboard.hard, color: "#ef687c" },
                  ]}
                  note="Difficulty totals are combined from the linked platforms where Codolio reports them."
                />
                <section className="progress-card coding-rating-card">
                  <div className="progress-section-heading"><div><p className="progress-eyebrow">Competitive programming</p><h2>Contest ratings</h2></div></div>
                  <div className="coding-rating-summary">
                    {dashboard.ratings.map((rating) => (
                      <div key={rating.platform}><span>{rating.platform === "leetcode" ? "LeetCode" : "CodeChef"}</span><strong>{Number.isFinite(rating.rating) ? rating.rating.toLocaleString() : "—"}</strong><small>Peak {Number.isFinite(rating.maxRating) ? rating.maxRating.toLocaleString() : "—"}</small></div>
                    ))}
                    <span className="coding-contest-count">{dashboard.contestEntries.length} rating records</span>
                  </div>
                  <ContestRatingChart contests={dashboard.contestEntries} />
                </section>
              </div>

              <div className="coding-analytics-secondary">
                <CodingDonut
                  title="Fundamentals"
                  items={[
                    ...dashboard.fundamentals.map((item, index) => ({ ...item, color: index === 0 ? "#56a1ff" : "#a87bff" })),
                    { label: "HackerRank", value: byPlatformQuestionCount(dashboard.platforms, "hackerrank"), color: "#39d1a1" },
                  ]}
                  note="Platform-reported foundational categories."
                />
                <CodingDonut
                  title="Contest practice"
                  items={dashboard.ratings.map((rating, index) => ({
                    label: rating.platform === "leetcode" ? "LeetCode" : "CodeChef",
                    value: dashboard.contestEntries.filter((contest) => contest.platform === rating.platform).length,
                    color: index === 0 ? "#51d3b0" : "#668cff",
                  }))}
                  note="Count of rating history entries available from Codolio."
                />
              </div>
            </div>

            <section className="progress-card coding-topics-card">
              <div className="progress-section-heading"><div><p className="progress-eyebrow">Aggregated across platform profiles</p><h2>DSA topic analysis</h2></div></div>
              {dashboard.topics.length ? (
                <div className="coding-topic-list">
                  {dashboard.topics.map(([topic, count]) => (
                    <div className="coding-topic-row" key={topic}><span>{topic}</span><div><i style={{ width: `${Math.max(4, (count / dashboard.topics[0][1]) * 100)}%` }} /></div><strong>{count.toLocaleString()}</strong></div>
                  ))}
                </div>
              ) : <p className="progress-empty">Topic analysis is not currently available.</p>}
            </section>
          </div>
        </div>
      )}
      {data.githubError && <p className="progress-data-caveat"><CircleHelp size={14} /> {data.githubError} The rest of your Codolio stats are still live.</p>}
      <p className="progress-data-caveat"><CircleHelp size={14} /> Statistics are supplied by Codolio&apos;s public profile data and follow its sync schedule; they may not update immediately after activity.</p>
    </div>
  );
}

const byPlatformQuestionCount = (platforms, platformName) =>
  platforms.find((platform) => platform.platform === platformName)?.questions || 0;

export default function Progress() {
  const [tracker, setTracker] = useState("dsa");
  const [noteSelection, setNoteSelection] = useState("");
  const [studyStatuses, setStudyStatuses] = useState(() => {
    const saved = getStoredValue(STUDY_PROGRESS_KEY, {});
    return saved && typeof saved === "object" && !Array.isArray(saved) ? saved : {};
  });
  const [studyNotes, setStudyNotes] = useState(() => {
    const saved = getStoredValue(STUDY_NOTES_KEY, {});
    return saved && typeof saved === "object" && !Array.isArray(saved) ? saved : {};
  });
  const [studyDetails, setStudyDetails] = useState(() => {
    const saved = getStoredValue(STUDY_DETAILS_KEY, {});
    return saved && typeof saved === "object" && !Array.isArray(saved) ? saved : {};
  });
  const [studyTopics, setStudyTopics] = useState(() => {
    const saved = getStoredValue(STUDY_TOPICS_KEY, {});
    return Object.fromEntries(
      Object.entries(STUDY_SUBJECTS).map(([subjectId, subject]) => {
        const savedTopics = saved?.[subjectId];
        const topics = Array.isArray(savedTopics) ? savedTopics : subject.topics;
        return [subjectId, [...new Set(topics.filter((topic) => typeof topic === "string" && topic.trim()).map((topic) => topic.trim()))]];
      }),
    );
  });
  const [log, setLog] = useState(() => {
    const saved = getStoredValue(DSA_LOG_KEY, []);
    return Array.isArray(saved) ? saved.filter((entry) => entry && typeof entry.date === "string" && Number.isInteger(entry.solved) && entry.solved > 0) : [];
  });
  const [username, setUsername] = useState(() => {
    try {
      return window.localStorage.getItem(GITHUB_USER_KEY) || DEFAULT_GITHUB_USER;
    } catch {
      return DEFAULT_GITHUB_USER;
    }
  });

  const updateUsername = (nextUsername) => {
    setUsername(nextUsername);
    try {
      window.localStorage.setItem(GITHUB_USER_KEY, nextUsername);
    } catch {
      // Keep the selected username active for this session.
    }
  };

  const saveStudyDetails = (key, value) => {
    const updatedDetails = { ...studyDetails, [key]: value };
    const updatedStatuses = { ...studyStatuses, [key]: value.status };
    const updatedNotes = { ...studyNotes, [key]: value.notes };
    setStudyDetails(updatedDetails);
    setStudyStatuses(updatedStatuses);
    setStudyNotes(updatedNotes);
    try {
      window.localStorage.setItem(STUDY_DETAILS_KEY, JSON.stringify(updatedDetails));
      window.localStorage.setItem(STUDY_PROGRESS_KEY, JSON.stringify(updatedStatuses));
      window.localStorage.setItem(STUDY_NOTES_KEY, JSON.stringify(updatedNotes));
    } catch {
      // Keep the topic details visible for this session if browser storage is unavailable.
    }
  };

  const addStudyTopic = (subjectId, topic) => {
    const updated = { ...studyTopics, [subjectId]: [...studyTopics[subjectId], topic] };
    setStudyTopics(updated);
    try {
      window.localStorage.setItem(STUDY_TOPICS_KEY, JSON.stringify(updated));
    } catch {
      // Keep the updated roadmap available for this session if browser storage is unavailable.
    }
  };

  const renameStudyTopic = (subjectId, oldTopic, newTopic) => {
    const oldKey = topicKey(subjectId, oldTopic);
    const newKey = topicKey(subjectId, newTopic);
    const updatedTopics = {
      ...studyTopics,
      [subjectId]: studyTopics[subjectId].map((topic) => topic === oldTopic ? newTopic : topic),
    };
    const moveTopicData = (values) => {
      if (!Object.prototype.hasOwnProperty.call(values, oldKey)) return values;
      const updated = { ...values, [newKey]: values[oldKey] };
      delete updated[oldKey];
      return updated;
    };
    const updatedStatuses = moveTopicData(studyStatuses);
    const updatedNotes = moveTopicData(studyNotes);
    const updatedDetails = moveTopicData(studyDetails);
    setStudyTopics(updatedTopics);
    setStudyStatuses(updatedStatuses);
    setStudyNotes(updatedNotes);
    setStudyDetails(updatedDetails);
    try {
      window.localStorage.setItem(STUDY_TOPICS_KEY, JSON.stringify(updatedTopics));
      window.localStorage.setItem(STUDY_PROGRESS_KEY, JSON.stringify(updatedStatuses));
      window.localStorage.setItem(STUDY_NOTES_KEY, JSON.stringify(updatedNotes));
      window.localStorage.setItem(STUDY_DETAILS_KEY, JSON.stringify(updatedDetails));
    } catch {
      // Keep the renamed topic and its saved details available for this session.
    }
  };

  const removeStudyTopic = (subjectId, topic) => {
    if (!window.confirm(`Remove "${topic}" and its saved progress and notes?`)) return;
    const key = topicKey(subjectId, topic);
    const updatedTopics = {
      ...studyTopics,
      [subjectId]: studyTopics[subjectId].filter((item) => item !== topic),
    };
    const removeTopicData = (values) => {
      const updated = { ...values };
      delete updated[key];
      return updated;
    };
    const updatedStatuses = removeTopicData(studyStatuses);
    const updatedNotes = removeTopicData(studyNotes);
    const updatedDetails = removeTopicData(studyDetails);
    setStudyTopics(updatedTopics);
    setStudyStatuses(updatedStatuses);
    setStudyNotes(updatedNotes);
    setStudyDetails(updatedDetails);
    try {
      window.localStorage.setItem(STUDY_TOPICS_KEY, JSON.stringify(updatedTopics));
      window.localStorage.setItem(STUDY_PROGRESS_KEY, JSON.stringify(updatedStatuses));
      window.localStorage.setItem(STUDY_NOTES_KEY, JSON.stringify(updatedNotes));
      window.localStorage.setItem(STUDY_DETAILS_KEY, JSON.stringify(updatedDetails));
    } catch {
      // Keep the updated roadmap available for this session if browser storage is unavailable.
    }
  };

  return (
    <main className="progress-page">
      <div className="progress-container">
        <header className="progress-header">
          <div>
            <p className="progress-eyebrow"><span className="progress-live-dot" /> YOUR DEVELOPER JOURNEY</p>
            <h1>Progress <span>Tracker</span></h1>
            <p className="progress-subtitle">A clearer view of your practice and the work you share.</p>
          </div>
          <TrackerPicker value={tracker} onChange={(value) => { setTracker(value); setNoteSelection(""); }} />
        </header>
        {tracker === "dsa" ? <DsaTracker log={log} setLog={setLog} /> : tracker === "github" ? <GitHubTracker username={username} onUsernameChange={updateUsername} /> : tracker === "codingJourney" ? <CodingJourney /> : (
          <SubjectTracker
            key={tracker}
            subjectId={tracker}
            subject={STUDY_SUBJECTS[tracker]}
            topics={studyTopics[tracker] || STUDY_SUBJECTS[tracker].topics}
            statuses={studyStatuses}
            notes={studyNotes}
            details={studyDetails}
            noteSelection={noteSelection}
            setNoteSelection={setNoteSelection}
            saveDetails={saveStudyDetails}
            onAddTopic={addStudyTopic}
            onRenameTopic={renameStudyTopic}
            onRemoveTopic={removeStudyTopic}
          />
        )}
        <footer className="progress-footer">
          <span><ArrowUpRight size={14} /> Keep showing up, one session at a time.</span>
          <span><ArrowDownRight size={14} /> Data is personal and never sent to a server.</span>
        </footer>
      </div>
    </main>
  );
}
