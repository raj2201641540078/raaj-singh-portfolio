import React, { useState } from "react";
import { Send, Phone, MapPin, Mail } from "lucide-react";
import {
  FaGithub,
  FaLinkedin,
  FaWhatsapp,
  FaEnvelope,
} from "react-icons/fa";
import profilePhoto from "../assets/images/profile.png";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState(null);

  const validateForm = () => {
    let tempErrors = {};
    let isValid = true;

    if (!formData.name.trim()) {
      tempErrors.name = "Name is required";
      isValid = false;
    }

    if (!formData.email.trim()) {
      tempErrors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      tempErrors.email = "Email is invalid";
      isValid = false;
    }

    if (!formData.subject.trim()) {
      tempErrors.subject = "Subject is required";
      isValid = false;
    }

    if (!formData.message.trim()) {
      tempErrors.message = "Message is required";
      isValid = false;
    }

    setErrors(tempErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      setStatus("Please fill in all required fields correctly.");
      return;
    }

    // Create a new FormData object to send to Web3Forms API
    const form = new FormData();
    form.append("access_key", "27823713-322b-43d8-a3d8-ff9063ca913e"); // Replace with your Web3Forms access key
    form.append("name", formData.name);
    form.append("email", formData.email);
    form.append("subject", formData.subject || "New Contact Form Submission");
    form.append("message", formData.message);

    try {
      // Send form data to Web3Forms API
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: form,
      });

      const result = await response.json();

      if (response.ok) {
        setStatus("Message sent successfully!");
        setFormData({
          name: "",
          email: "",
          subject: "",
          message: "",
        });
        setErrors({});
      } else {
        setStatus(result.message || "There was an error sending your message.");
      }
    } catch (error) {
      setStatus("An error occurred. Please try again.");
      console.error("Error:", error);
    }
  };

  return (
    <main className="pt-20 sm:pt-24 lg:pt-8 bg-gradient-to-b from-[#020617] via-[#0a0f1f] to-[#000D1A]/90 text-white min-h-screen">
      {/* Social Media Section with Photo */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 md:px-8 lg:px-10 border-b border-gray-700/30">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10 md:gap-12 lg:gap-20 items-center">
            {/* Profile Photo */}
            <div className="flex justify-center order-2 md:order-1">
              <div className="relative w-40 h-40 sm:w-48 sm:h-48 md:w-56 md:h-56 lg:w-64 lg:h-64">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 rounded-3xl opacity-25 blur-2xl"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 rounded-3xl p-1">
                  <div className="w-full h-full bg-gray-900 rounded-3xl flex items-center justify-center overflow-hidden">
                    <img
                      src={profilePhoto}
                      alt="Raj Singh"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="space-y-6 sm:space-y-8 order-1 md:order-2">
              <div>
                <h2 className="text-3xl sm:text-4xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent leading-tight">
                  Let's Connect
                </h2>
                <p className="text-sm sm:text-base md:text-lg text-gray-300 leading-relaxed">
                  Reach out through any platform. Let's build something amazing together!
                </p>
              </div>

              {/* Social Media Icons Grid */}
              <div className="flex justify-start items-center gap-3 sm:gap-4 md:gap-6 flex-wrap">
                {/* GitHub */}
                <a
                  href="https://github.com/raj2201641540078"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-18 lg:h-18 flex items-center justify-center transition-transform duration-300 hover:scale-110"
                  title="GitHub"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-gray-600 to-gray-700 rounded-full opacity-0 group-hover:opacity-100 blur-lg transition-all duration-300"></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-gray-600 to-gray-700 rounded-full border-2 border-gray-500 group-hover:border-gray-300 transition-all duration-300"></div>
                  <FaGithub className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 text-gray-300 relative z-10 group-hover:text-white transition-colors" />
                </a>

                {/* LinkedIn */}
                <a
                  href="https://www.linkedin.com/in/raj-singh-201514292/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-18 lg:h-18 flex items-center justify-center transition-transform duration-300 hover:scale-110"
                  title="LinkedIn"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full opacity-0 group-hover:opacity-100 blur-lg transition-all duration-300"></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full border-2 border-blue-500 group-hover:border-blue-300 transition-all duration-300"></div>
                  <FaLinkedin className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 text-blue-300 relative z-10 group-hover:text-white transition-colors" />
                </a>

                {/* Email */}
                <a
                  href="mailto:raajjsingh8179@gmail.com"
                  className="group relative w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-18 lg:h-18 flex items-center justify-center transition-transform duration-300 hover:scale-110"
                  title="Email"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-orange-600 rounded-full opacity-0 group-hover:opacity-100 blur-lg transition-all duration-300"></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-orange-600 rounded-full border-2 border-red-500 group-hover:border-red-300 transition-all duration-300"></div>
                  <FaEnvelope className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 text-red-300 relative z-10 group-hover:text-white transition-colors" />
                </a>

                {/* WhatsApp */}
                <a
                  href="https://wa.me/916387683918"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-18 lg:h-18 flex items-center justify-center transition-transform duration-300 hover:scale-110"
                  title="WhatsApp"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-green-700 rounded-full opacity-0 group-hover:opacity-100 blur-lg transition-all duration-300"></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-green-700 rounded-full border-2 border-green-500 group-hover:border-green-300 transition-all duration-300"></div>
                  <FaWhatsapp className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 text-green-300 relative z-10 group-hover:text-white transition-colors" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 md:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 md:gap-12 lg:gap-16 items-start lg:items-center">
            {/* Contact Info */}
            <div className="space-y-6 sm:space-y-8">
              <div>
                <h2 className="text-3xl sm:text-4xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent leading-tight">
                  Get in Touch
                </h2>
                <p className="text-sm sm:text-base md:text-lg text-gray-300 leading-relaxed">
                  Have a question or want to collaborate? Send me a message and I'll respond as soon as possible!
                </p>
              </div>

              <div className="space-y-4 sm:space-y-5">
                {/* Email */}
                <div className="flex items-start sm:items-center gap-3 sm:gap-4 p-4 rounded-xl bg-gradient-to-br from-purple-500/10 to-transparent border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300">
                  <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mt-0.5 sm:mt-0">
                    <Mail className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-sm sm:text-base text-white">Email</h3>
                    <p className="text-xs sm:text-sm text-gray-400 break-all">raajjsingh8179@gmail.com</p>
                  </div>
                </div>

                {/* WhatsApp */}
                <div className="flex items-start sm:items-center gap-3 sm:gap-4 p-4 rounded-xl bg-gradient-to-br from-green-500/10 to-transparent border border-green-500/20 hover:border-green-500/40 transition-all duration-300">
                  <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-green-500/20 rounded-lg flex items-center justify-center mt-0.5 sm:mt-0">
                    <FaWhatsapp className="w-5 h-5 sm:w-6 sm:h-6 text-green-400" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-sm sm:text-base text-white">WhatsApp</h3>
                    <p className="text-xs sm:text-sm text-gray-400">+91 6387683918</p>
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-start sm:items-center gap-3 sm:gap-4 p-4 rounded-xl bg-gradient-to-br from-pink-500/10 to-transparent border border-pink-500/20 hover:border-pink-500/40 transition-all duration-300">
                  <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-pink-500/20 rounded-lg flex items-center justify-center mt-0.5 sm:mt-0">
                    <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-pink-400" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-sm sm:text-base text-white">Location</h3>
                    <p className="text-xs sm:text-sm text-gray-400">Kanpur, Uttar Pradesh, India</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="w-full backdrop-blur-xl bg-white/[0.03] border border-white/10 p-6 sm:p-8 md:p-10 rounded-2xl shadow-2xl shadow-cyan-500/5 hover:shadow-cyan-500/10 transition-shadow duration-300">
              <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
                {/* Name Field */}
                <div className="space-y-2">
                  <label className="text-xs sm:text-sm font-medium text-gray-300">Full Name</label>
                  <input
                    type="text"
                    placeholder="John Doe"
                    className={`w-full px-4 sm:px-5 py-2.5 sm:py-3 text-sm sm:text-base rounded-lg bg-white/5 border transition-all duration-200 ${
                      errors.name ? "border-red-500 focus:border-red-600" : "border-white/10 hover:border-white/20 focus:border-cyan-400"
                    } focus:outline-none focus:ring-1 focus:ring-cyan-400/30`}
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                  {errors.name && (
                    <p className="text-xs sm:text-sm text-red-400">{errors.name}</p>
                  )}
                </div>

                {/* Email Field */}
                <div className="space-y-2">
                  <label className="text-xs sm:text-sm font-medium text-gray-300">Email Address</label>
                  <input
                    type="email"
                    placeholder="your.email@example.com"
                    className={`w-full px-4 sm:px-5 py-2.5 sm:py-3 text-sm sm:text-base rounded-lg bg-white/5 border transition-all duration-200 ${
                      errors.email ? "border-red-500 focus:border-red-600" : "border-white/10 hover:border-white/20 focus:border-cyan-400"
                    } focus:outline-none focus:ring-1 focus:ring-cyan-400/30`}
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />
                  {errors.email && (
                    <p className="text-xs sm:text-sm text-red-400">{errors.email}</p>
                  )}
                </div>

                {/* Subject Field */}
                <div className="space-y-2">
                  <label className="text-xs sm:text-sm font-medium text-gray-300">Subject</label>
                  <input
                    type="text"
                    placeholder="Project Collaboration..."
                    className={`w-full px-4 sm:px-5 py-2.5 sm:py-3 text-sm sm:text-base rounded-lg bg-white/5 border transition-all duration-200 ${
                      errors.subject ? "border-red-500 focus:border-red-600" : "border-white/10 hover:border-white/20 focus:border-cyan-400"
                    } focus:outline-none focus:ring-1 focus:ring-cyan-400/30`}
                    value={formData.subject}
                    onChange={(e) =>
                      setFormData({ ...formData, subject: e.target.value })
                    }
                  />
                  {errors.subject && (
                    <p className="text-xs sm:text-sm text-red-400">{errors.subject}</p>
                  )}
                </div>

                {/* Message Field */}
                <div className="space-y-2">
                  <label className="text-xs sm:text-sm font-medium text-gray-300">Message</label>
                  <textarea
                    placeholder="Your message here..."
                    rows="4"
                    className={`w-full px-4 sm:px-5 py-2.5 sm:py-3 text-sm sm:text-base rounded-lg bg-white/5 border transition-all duration-200 resize-none ${
                      errors.message ? "border-red-500 focus:border-red-600" : "border-white/10 hover:border-white/20 focus:border-cyan-400"
                    } focus:outline-none focus:ring-1 focus:ring-cyan-400/30`}
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                  ></textarea>
                  {errors.message && (
                    <p className="text-xs sm:text-sm text-red-400">{errors.message}</p>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 hover:from-cyan-600 hover:via-blue-600 hover:to-purple-600 text-white font-semibold py-3 sm:py-3.5 px-4 sm:px-6 rounded-lg flex items-center justify-center gap-2 transition-all duration-300 transform hover:scale-[1.02] active:scale-95 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40"
                >
                  <span className="text-sm sm:text-base">Send Message</span>
                  <Send className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </form>

              {/* Status Message */}
              {status && (
                <div
                  className={`mt-4 p-3 sm:p-4 rounded-lg text-xs sm:text-sm text-center transition-all duration-300 ${
                    status.includes("success")
                      ? "bg-green-500/10 border border-green-500/30 text-green-400"
                      : "bg-red-500/10 border border-red-500/30 text-red-400"
                  }`}
                >
                  <p>{status}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
