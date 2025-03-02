import React from "react";

interface Avatar {
  src: string;
  alt?: string;
}

interface AvatarStackProps {
  avatars: Avatar[];
  maxVisible?: number;
}

const AvatarStack: React.FC<AvatarStackProps> = ({ avatars, maxVisible = 4 }) => {
  return (
    <div className="flex -space-x-4 rtl:space-x-reverse">
      {avatars.slice(0, maxVisible).map((avatar, index) => (
        <img
          key={index}
          className="w-8 h-8 border-2 border-white rounded-full dark:border-gray-800"
          src={avatar.src}
          alt={avatar.alt || "Avatar"}
        />
      ))}
      {avatars.length > maxVisible && (
        <a
          className="flex items-center justify-center w-8 h-8 text-xs font-medium text-white bg-gray-700 border-2 border-white rounded-full hover:bg-gray-600 dark:border-gray-800"
          href="#"
        >
          +{avatars.length - maxVisible}
        </a>
      )}
    </div>
  );
};

export default AvatarStack;
