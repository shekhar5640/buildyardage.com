import React, { useState, useEffect } from 'react';

export default function FooterEmail() {
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    // Dynamically assemble email address at runtime after mount
    const user = 'contact';
    const domain = 'buildyardage.com';
    setEmail(`${user}@${domain}`);
  }, []);

  if (!email) {
    return (
      <span className="text-zinc-500 font-mono text-xs sm:text-sm">
        contact [at] buildyardage.com
      </span>
    );
  }

  return (
    <a
      href={`mailto:${email}`}
      className="text-brand-accent hover:underline font-mono text-xs sm:text-sm"
    >
      {email}
    </a>
  );
}
