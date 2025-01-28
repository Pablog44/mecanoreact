import React, { useEffect, useState, useRef } from 'react';

// Palabras base para generar texto aleatorio
const WORDS_LIST = [
  'casa', 'perro', 'gato', 'programar', 'react', 'teclado', 'pantalla',
  'javascript', 'ventana', 'boton', 'monitor', 'coche', 'futbol', 'musica',
  'camino', 'borrar', 'clase', 'contexto', 'desarrollo', 'tecnologia',
  'internet', 'mecanografia', 'espacio', 'componente', 'estado', 'props',
  'tiempo', 'fallo', 'acierto', 'ejemplo', 'completo', 'css', 'html',
  'minuto', 'segundo', 'palabra', 'codigo', 'github', 'computadora',
  'consola', 'variable', 'funcion', 'constante', 'aleatorio', 'texto',
  'contenido', 'arreglo', 'estilo', 'control', 'logica'
];

// Mezcla el arreglo de palabras y toma "count" palabras
function getRandomWords(count) {
  const shuffled = [...WORDS_LIST].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

function App() {
  // Número de palabras a practicar
  const WORD_COUNT = 20;

  // Guardamos el texto completo (como array de caracteres) en "allChars"
  const [allChars, setAllChars] = useState([]);
  // "remainingChars" son los caracteres que aún no se han escrito bien
  const [remainingChars, setRemainingChars] = useState([]);
  // Estado de finalización
  const [finished, setFinished] = useState(false);

  // Contadores
  const [correct, setCorrect] = useState(0);
  const [incorrect, setIncorrect] = useState(0);

  // Tiempo
  const [startTime, setStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);

  // Referencia al input para focusearlo
  const inputRef = useRef(null);

  // Al montar el componente, iniciamos el ejercicio
  useEffect(() => {
    initializeExercise();
  }, []);

  // Iniciamos el cronómetro la primera vez que hay un acierto o fallo
  useEffect(() => {
    if (!startTime && (correct > 0 || incorrect > 0)) {
      setStartTime(Date.now());
    }
  }, [correct, incorrect, startTime]);

  // Actualizamos "elapsedTime" mientras no hayamos terminado
  useEffect(() => {
    let timer;
    if (startTime && !finished) {
      timer = setInterval(() => {
        const now = Date.now();
        setElapsedTime(Math.floor((now - startTime) / 1000));
      }, 500);
    }
    return () => clearInterval(timer);
  }, [startTime, finished]);

  // Manejo de teclas
  const handleKeyDown = (e) => {
    // ESC para reiniciar
    if (e.key === 'Escape') {
      handleReset();
      return;
    }
    if (!finished) {
      processKey(e.key);
    }
  };

  // Lógica al pulsar una tecla
  const processKey = (key) => {
    // Si no hay más caracteres, hemos terminado
    if (remainingChars.length === 0) {
      setFinished(true);
      return;
    }

    const nextChar = remainingChars[0];

    // Verificamos si es un carácter de longitud 1 (incluye espacio, símbolos, etc.)
    if (key.length === 1) {
      if (key === nextChar) {
        // Acierto
        setCorrect((prev) => prev + 1);
        setRemainingChars((prev) => prev.slice(1));
        // Si hemos consumido el último carácter
        if (remainingChars.length === 1) {
          setFinished(true);
        }
      } else {
        // Fallo
        setIncorrect((prev) => prev + 1);
      }
    }
  };

  // Inicialización o reinicio
  const initializeExercise = () => {
    const words = getRandomWords(WORD_COUNT);
    const fullText = words.join(' '); // texto con espacios entre palabras

    const arr = fullText.split('');
    setAllChars(arr);
    setRemainingChars(arr);

    setFinished(false);
    setCorrect(0);
    setIncorrect(0);
    setStartTime(null);
    setElapsedTime(0);

    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // Manejo de reinicio (botón o ESC)
  const handleReset = () => {
    initializeExercise();
  };

  // Cálculo de PPM
  const ppm = elapsedTime > 0 ? Math.round((correct / elapsedTime) * 60) : 0;

  // Cálculo del índice de caracteres ya tecleados correctamente
  const typedIndex = allChars.length - remainingChars.length;

  // Separamos el texto en "typedPart" y "untypedPart"
  const typedPart = typedIndex > 0 ? allChars.slice(0, typedIndex).join('') : '';
  const untypedPart = typedIndex < allChars.length
    ? allChars.slice(typedIndex).join('')
    : '';

  return (
    <>
      {/* Aquí definimos la animación en un bloque <style> */}
      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>

      <div style={styles.appBackground}>
        <div style={styles.container}>
          <h1 style={styles.title}>Práctica de Mecanografía</h1>

          {/* Estadísticas */}
          <div style={styles.statsContainer}>
            <div style={styles.statBox}>
              <span style={styles.statLabel}>Aciertos:</span> {correct}
            </div>
            <div style={styles.statBox}>
              <span style={styles.statLabel}>Fallos:</span> {incorrect}
            </div>
            <div style={styles.statBox}>
              <span style={styles.statLabel}>Tiempo (s):</span> {elapsedTime}
            </div>
            <div style={styles.statBox}>
              <span style={styles.statLabel}>PPM:</span> {ppm}
            </div>
          </div>

          {/* Texto con caret parpadeante */}
          <div style={styles.textContainer}>
            <span style={styles.typedText}>{typedPart}</span>
            {/* Si no hemos terminado todo, mostramos el caret */}
            {typedIndex < allChars.length && (
              <span style={styles.caret}>|</span>
            )}
            <span style={styles.untypedText}>{untypedPart}</span>
          </div>

          <p style={styles.helpText}>
            Pulsa las teclas para escribir.
            <br />
            Presiona <b>Escape</b> o haz clic en <b>Reiniciar</b> para comenzar de nuevo.
          </p>

          <button style={styles.resetButton} onClick={handleReset}>
            Reiniciar
          </button>

          {/* Input oculto para capturar teclas */}
          <input
            ref={inputRef}
            type="text"
            onKeyDown={handleKeyDown}
            style={styles.hiddenInput}
          />

          {/* Mensaje de finalización */}
          {finished && (
            <div style={styles.finishedMessage}>
              <h2>¡Has terminado!</h2>
              <p>Palabras totales: {WORD_COUNT}</p>
              <p>Aciertos: {correct}</p>
              <p>Fallos: {incorrect}</p>
              <p>Tiempo total: {elapsedTime} seg</p>
              <p>PPM final: {ppm}</p>
              <button style={styles.resetButton} onClick={handleReset}>
                Reiniciar
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

const styles = {
  appBackground: {
    minHeight: '100vh',
    margin: 0,
    padding: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #74ABE2, #5563DE)',
  },
  container: {
    width: '80%',
    maxWidth: '700px',
    margin: '40px auto',
    padding: '20px',
    borderRadius: '12px',
    backgroundColor: '#FFFFFFEE',
    boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
    textAlign: 'center',
    fontFamily: 'Arial, sans-serif',
  },
  title: {
    marginBottom: '20px',
    color: '#333',
  },
  statsContainer: {
    display: 'flex',
    justifyContent: 'space-around',
    marginBottom: '20px',
    flexWrap: 'wrap',
    gap: '10px',
  },
  statBox: {
    backgroundColor: '#f5f5f5',
    padding: '10px 15px',
    borderRadius: '8px',
    minWidth: '100px',
    boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.1)',
  },
  statLabel: {
    fontWeight: 'bold',
    marginRight: '5px',
    color: '#444',
  },
  textContainer: {
    minHeight: '80px',
    marginBottom: '20px',
    border: '1px solid #ccc',
    padding: '15px',
    borderRadius: '8px',
    backgroundColor: '#fafafa',
    maxHeight: '200px',
    overflowY: 'auto',
  },
  typedText: {
    fontSize: '24px',
    lineHeight: '1.5',
    fontFamily: 'monospace',
    color: '#333',
  },
  // El cursor (caret) parpadea con la animación "blink"
  caret: {
    fontSize: '24px',
    fontFamily: 'monospace',
    color: '#333',
    marginLeft: '-1px',
    marginRight: '2px',
    animation: 'blink 1s infinite steps(1, start)',
  },
  untypedText: {
    fontSize: '24px',
    lineHeight: '1.5',
    fontFamily: 'monospace',
    color: '#999',
  },
  helpText: {
    fontSize: '14px',
    color: '#666',
    margin: '15px 0',
  },
  resetButton: {
    backgroundColor: '#5563DE',
    color: '#fff',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '16px',
    margin: '0 auto 20px',
  },
  hiddenInput: {
    opacity: 0,
    position: 'absolute',
    left: '-9999px',
  },
  finishedMessage: {
    marginTop: '20px',
    backgroundColor: '#e2f9e1',
    padding: '20px',
    borderRadius: '8px',
    border: '1px solid #b2e6b0',
  },
};

export default App;
