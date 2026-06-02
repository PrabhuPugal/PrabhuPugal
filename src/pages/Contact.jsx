import { useState } from "react";
import { Mail, Send } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "../components/SocialIcons";
import SectionReveal from "../components/SectionReveal";
import styles from "./Contact.module.css";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    const { name, email, message } = form;
    const subject = encodeURIComponent(`Message from ${name}`);
    const body = encodeURIComponent(`${message}\n\n— ${name} (${email})`);
    window.location.href = `mailto:prabhupugal01@gmail.com?subject=${subject}&body=${body}`;
  };

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  return (
    <main className="section">
      <div className="container">
        <SectionReveal>
          <div className="section-header">
            <span className="section-label">07 / contact</span>
            <h2 className="section-title">Get in Touch</h2>
          </div>
        </SectionReveal>

        <div className={styles.grid}>
          <SectionReveal delay={0.1}>
            <div className={styles.info}>
              <p className={styles.intro}>
                I'm always open to interesting conversations — whether it's about
                research, AI systems, new ideas, or opportunities. Drop me a message.
              </p>

              <div className={styles.links}>
                <a href="mailto:prabhupugal01@gmail.com" className={styles.link}>
                  <Mail size={18} />
                  <span>prabhupugal01@gmail.com</span>
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.link}
                >
                  <LinkedinIcon size={18} />
                  <span>LinkedIn</span>
                </a>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.link}
                >
                  <GithubIcon size={18} />
                  <span>GitHub</span>
                </a>
              </div>

              <div className={styles.resumeWrap}>
                <a
                  href="/Prabhu Pugalenthi Resume.pdf"
                  download
                  className={styles.resumeBtn}
                >
                  Download Resume ↓
                </a>
              </div>
            </div>
          </SectionReveal>

          <SectionReveal delay={0.2}>
            <form className={styles.form} onSubmit={handleSubmit}>
              <div className={styles.field}>
                <label className={styles.label} htmlFor="contact-name">Name</label>
                <input
                  id="contact-name"
                  name="name"
                  type="text"
                  required
                  className={styles.input}
                  placeholder="Your name"
                  value={form.name}
                  onChange={handleChange}
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label} htmlFor="contact-email">Email</label>
                <input
                  id="contact-email"
                  name="email"
                  type="email"
                  required
                  className={styles.input}
                  placeholder="your@email.com"
                  value={form.email}
                  onChange={handleChange}
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label} htmlFor="contact-message">Message</label>
                <textarea
                  id="contact-message"
                  name="message"
                  required
                  rows={5}
                  className={styles.textarea}
                  placeholder="What's on your mind?"
                  value={form.message}
                  onChange={handleChange}
                />
              </div>
              <button type="submit" className={styles.submit}>
                <Send size={15} />
                Send Message
              </button>
            </form>
          </SectionReveal>
        </div>
      </div>
    </main>
  );
}
