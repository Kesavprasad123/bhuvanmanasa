import { useState, useRef, useEffect, useCallback } from 'react';
import { useLanguage } from '../context/LanguageContext';

function LanguageSelector({ variant = 'fixed' }) {
  const { language, setLanguage, languages, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);
  const triggerRef = useRef(null);

  const toggleDropdown = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const handleSelectLanguage = useCallback(
    (code) => {
      setLanguage(code);
      setIsOpen(false);
      if (triggerRef.current) {
        triggerRef.current.focus();
      }
    },
    [setLanguage]
  );

  // Close when clicking outside or pressing Escape
  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
        if (triggerRef.current) {
          triggerRef.current.focus();
        }
      }
    };

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const currentLangObj = languages.find((l) => l.code === language) || languages[0];

  return (
    <div
      ref={containerRef}
      className={`lang-selector-wrap ${variant === 'topbar' ? 'is-topbar' : 'is-fixed'}${
        isOpen ? ' is-open' : ''
      }`}
    >
      <button
        ref={triggerRef}
        type="button"
        className="lang-selector-btn"
        onClick={toggleDropdown}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label={`${t('languageSelector.label', 'Language')}: ${currentLangObj.name} (${currentLangObj.label})`}
        title={t('languageSelector.changeLanguage', 'Change Language')}
      >
        <span className="lang-icon" aria-hidden="true">🌐</span>
        <span className="lang-text-group">
          <span className="lang-label-prefix">{t('languageSelector.label', 'Language')}:</span>
          <strong className="lang-current-label">{currentLangObj.label}</strong>
        </span>
        <span className={`lang-chevron${isOpen ? ' is-open' : ''}`} aria-hidden="true">
          ▾
        </span>
      </button>

      {isOpen && (
        <ul
          className="lang-dropdown-menu"
          role="listbox"
          aria-label={t('languageSelector.label', 'Language')}
        >
          {languages.map((item) => {
            const isSelected = item.code === language;
            return (
              <li key={item.code} role="presentation">
                <button
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  className={`lang-option-item${isSelected ? ' is-selected' : ''}`}
                  onClick={() => handleSelectLanguage(item.code)}
                >
                  <span className="lang-option-flag" aria-hidden="true">
                    {item.flag}
                  </span>
                  <div className="lang-option-names">
                    <span className="lang-native-name">{item.label}</span>
                    <span className="lang-english-name">{item.name}</span>
                  </div>
                  {isSelected && (
                    <span className="lang-check" aria-hidden="true">
                      ✓
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default LanguageSelector;

