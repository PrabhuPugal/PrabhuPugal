import { motion, AnimatePresence } from "framer-motion";
import { X, MapPin } from "lucide-react";
import { useEffect } from "react";
import styles from "./Lightbox.module.css";

export default function Lightbox({ item, onClose }) {
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <AnimatePresence>
      <motion.div
        className={styles.overlay}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className={`${styles.modal} ${item.orientation === "portrait" ? styles.portraitModal : styles.landscapeModal}`}
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 20 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          onClick={(e) => e.stopPropagation()}
        >
          <button className={styles.close} onClick={onClose} aria-label="Close">
            <X size={20} />
          </button>

          <div className={styles.imageWrap}>
            <img src={item.image} alt={item.city} className={styles.image} />
          </div>

          <div className={styles.info}>
            <div className={styles.location}>
              <MapPin size={16} />
              <span className={styles.city}>{item.city}</span>
              <span className={styles.country}>{item.country}</span>
            </div>
            <p className={styles.note}>{item.note}</p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
