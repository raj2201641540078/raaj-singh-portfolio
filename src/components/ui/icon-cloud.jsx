// "use client";
// import { useEffect, useMemo, useState } from "react";
// import { useTheme } from "next-themes";
// import { Cloud, fetchSimpleIcons, renderSimpleIcon } from "react-icon-cloud";

// export const cloudProps = {
//   containerProps: {
//     style: {
//       display: "flex",
//       justifyContent: "center",
//       alignItems: "center",
//       width: "100%",
//       paddingTop: 40,
//     },
//   },
//   options: {
//     reverse: true,
//     depth: 1,
//     wheelZoom: false,
//     imageScale: 2,
//     activeCursor: "default",
//     tooltip: "native",
//     initial: [0.1, -0.1],
//     clickToFront: 500,
//     tooltipDelay: 0,
//     outlineColour: "#000",
//     maxSpeed: 0.04,
//     minSpeed: 0.02,
//     // dragControl: false,
//   },
// };

// export const renderCustomIcon = (icon, theme, imageArray) => {
//   const bgHex = theme === "light" ? "#f3f2ef" : "#080510";
//   const fallbackHex = theme === "light" ? "#6e6e73" : "#ffffff";
//   const minContrastRatio = theme === "dark" ? 2 : 1.2;

//   return renderSimpleIcon({
//     icon,
//     bgHex,
//     fallbackHex,
//     minContrastRatio,
//     size: 42,
//     aProps: {
//       href: undefined,
//       target: undefined,
//       rel: undefined,
//       onClick: (e) => e.preventDefault(),
//     },
//   });
// };

// export default function IconCloud({
//   // Default to an empty array if not provided
//   iconSlugs = [],

//   imageArray,
// }) {
//   const [data, setData] = useState(null);
//   const { theme } = useTheme();

//   useEffect(() => {
//     if (iconSlugs.length > 0) {
//       // Check if iconSlugs is not empty
//       fetchSimpleIcons({ slugs: iconSlugs }).then(setData);
//     }
//   }, [iconSlugs]);

//   const renderedIcons = useMemo(() => {
//     if (!data) return null;

//     return Object.values(data.simpleIcons).map((icon) =>
//       renderCustomIcon(icon, theme || "dark")
//     );
//   }, [data, theme]);

//   return (
//     // @ts-ignore
//     <Cloud {...cloudProps}>
//       <>
//         <>{renderedIcons}</>
//         {imageArray &&
//           imageArray.length > 0 &&
//           imageArray.map((image, index) => {
//             return (
//               <a key={index} href="#" onClick={(e) => e.preventDefault()}>
//                 <img height="42" width="42" alt="A globe" src={image} />
//               </a>
//             );
//           })}
//       </>
//     </Cloud>
//   );
// }




"use client";

import { useEffect, useMemo, useState } from "react";
import { useTheme } from "next-themes";
import {
  Cloud,
  fetchSimpleIcons,
  renderSimpleIcon,
} from "react-icon-cloud";

export const cloudProps = {
  containerProps: {
    style: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      width: "100%",
      maxWidth: "100%",
      overflow: "hidden",
      paddingTop: 20,
    },
  },
  options: {
    reverse: true,
    depth: 1,
    wheelZoom: false,
    imageScale: 2,
    activeCursor: "default",
    tooltip: "native",
    initial: [0.1, -0.1],
    clickToFront: 500,
    tooltipDelay: 0,
    outlineColour: "#000",
    maxSpeed: 0.04,
    minSpeed: 0.02,
  },
};

export const renderCustomIcon = (icon, theme) => {
  return renderSimpleIcon({
    icon,
    bgHex: theme === "light" ? "#f3f2ef" : "#080510",
    fallbackHex: theme === "light" ? "#6e6e73" : "#ffffff",
    minContrastRatio: theme === "dark" ? 2 : 1.2,
    size: 42,
    aProps: {
      href: undefined,
      target: undefined,
      rel: undefined,
      onClick: (e) => e.preventDefault(),
    },
  });
};

export default function IconCloud({
  iconSlugs = [],
  imageArray = [],
}) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(false);
  const { resolvedTheme, theme } = useTheme();

  const slugKey = iconSlugs.join(",");
  const stableSlugs = useMemo(
    () => slugKey.split(",").filter(Boolean),
    [slugKey]
  );

  useEffect(() => {
    let cancelled = false;

    async function loadIcons() {
      try {
        setError(false);

        const result = await fetchSimpleIcons({
          slugs: stableSlugs,
        });

        if (!cancelled) {
          setData(result);
        }
      } catch (err) {
        console.error("Failed to load skill icons:", err);

        if (!cancelled) {
          setError(true);
        }
      }
    }

    if (stableSlugs.length > 0) {
      loadIcons();
    }

    return () => {
      cancelled = true;
    };
  }, [stableSlugs]);

  const renderedIcons = useMemo(() => {
    if (!data?.simpleIcons) return [];

    return Object.values(data.simpleIcons).map((icon) =>
      renderCustomIcon(icon, resolvedTheme || theme || "dark")
    );
  }, [data, resolvedTheme, theme]);

  if (error) {
    return (
      <div className="p-4 text-center text-sm text-gray-400">
        Unable to load skill icons. Please refresh the page.
      </div>
    );
  }

  return (
    <div className="w-full max-w-full overflow-hidden">
      <Cloud {...cloudProps}>
        <>
          {renderedIcons}
          {imageArray.map((image, index) => (
            <a
              key={`${image}-${index}`}
              href="#"
              onClick={(e) => e.preventDefault()}
            >
              <img
                height="42"
                width="42"
                alt="Technology icon"
                src={image}
              />
            </a>
          ))}
        </>
      </Cloud>
    </div>
  );
}
