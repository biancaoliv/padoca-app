// function Counter() {
//     // Declaramos o estado "count" com o valor inicial 0
//   const [count, setCount] = useState(0);

//   return (
//     <div>
//       <p>Contagem: {count}</p>
//       {/* setCount é usado para atualizar o valor do estado. */}
//       <button onClick={() => setCount(count + 1)}>Incrementar</button>
//     </div> 
//   );
// }

// useEffect(() => {
//   const fetchData = async () => {
//     try {
//       const response = await fetch("https://api.exemplo.com/dados"); 
//       // Busca os dados da API
//       const result = await response.json(); // Converte a resposta para JSON
//       setDados(result); // Armazena os dados no estado
//     } catch (error) {
//       console.error("Erro ao obter dados:", error); // Lida com possíveis erros
//     }
//   };

//   fetchData(); // Chama a função para buscar dados.
// }, []);


// const ThemeContext = React.createContext('light'); // Cria um contexto com valor 'light'

// function App() {
//   const theme = useContext(ThemeContext); // Acessa o valor do contexto

//   return <div>O tema atual é: {theme}</div>; // Retorna 'light'.
// }




const reducer = (estado, acao) => ({
    contagem: acao.tipo === 'incrementar' ? estado.contagem + 1 : estado.contagem - 1
}); // A função determina se deve incrementar ou decrementar o valor de contagem

function Contador() {
    const [estado, dispatch] = useReducer(reducer, { contagem: 0 });
    // Contém o estado atual inicialmente 0

    return (
        <div>
            <p>Contagem: {estado.contagem}</p>
            <button onClick={() => dispatch({ tipo: 'incrementar' })}>Incrementar</button>
            <button onClick={() => dispatch({ tipo: 'decrementar' })}>Decrementar</button>
        </div> // Ao clicar no botão incrementar, a ação faz o estado aumentar 'em' +1, o mesmo é válido para o Decrementar, que reduz 'em' -1.
    );
}


function App() {
  const inputRef = useRef(null); // Criamos uma referência para o campo de input

  const handleFocus = () => {
    inputRef.current.focus();  // Ao clicar, o campo de texto ganha foco.
  };

  return (
    <div>
      <input ref={inputRef} type="text" />
      <button onClick={handleFocus}>Focar no input</button>
    </div>
  );
}




