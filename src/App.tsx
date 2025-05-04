import { useEffect, useMemo, useState } from "react";
import "./App.css";

// espera uma lista desse tipo de pokémon
interface Pokemon {
  name: string;
  url: string;
}

function App() {
  // armazenar pokémon que tem name e url - lista de pokémon
  // pokemons é uma estante vazia e setPokemons é a pessoa que pega o livro e põe na estante (atualiza o estado, função)
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);

  // bool falso, sendo essa a tipagem
  const [loadingPokemons, setLoadingPokemons] = useState(false);

  // const [numero, setNumero] = useState(0);
  // const [count, setCount] = useState<number>(() => {
  //   const savedCount = localStorage.getItem("count");
  //   return savedCount ? Number(savedCount) : 0;
  // });

  // useEffect(() => {
  //   localStorage.setItem("count", count.toString());
  // }, [count]);

  // lifecicle - hook
  useEffect(() => {
    // tela começa aqui

    // loading começou
    setLoadingPokemons(true);
    fetch("http://localhost:3000/pokemon-list?limit=20")
      .then((res) => res.json())
      .then((data) => {
        // data é a listagem de pokémon - gravar em um estado da tela

        // colocar os pokémons da lista dentro da variável pokemons
        setPokemons(data);
        // terminou de carregar já
        setLoadingPokemons(false);
      });
    return () => {
      // return quando a tela morre
    };
  }, []); // quando dependência muda - exemplo, colocar uma ref ou botão, quando acontecer algo cai no useEffect
  console.log(pokemons);
  // o que o usuário vê

  const pokeballStyles = useMemo(() => {
    return [...Array(40)].map(() => ({
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      animationDuration: `${5 + Math.random() * 1}s`,
      animationDelay: `${Math.random() * 1}s`,
    }));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b flex justify-center items-center p-4">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        {pokeballStyles.map((style, index) => (
          <div
            key={index}
            className="absolute w-12 h-12 bg-[url('https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png')] bg-contain bg-no-repeat opacity-20 animate-floating"
            style={style}
          />
        ))}
      </div>

      {/* Nintendo DS Container */}
      <div className="w-full max-w-3xl">
        {/* Nintendo DS Top Screen */}
        <div className="bg-gray-800 rounded-t-3xl p-4 pb-6 relative shadow-lg border-8 border-gray-700">
          {/* Nintendo DS Screen interior */}
          <div className="bg-gray-900 rounded-xl p-1 relative overflow-hidden">
            {/* Nintendo DS Power Led */}
            <div className="absolute top-2 left-2 w-2 h-2 bg-green-500 rounded-full animate-pulse z-10" />
            {/* Nintendo DS Tela de cima */}
            <div className="bg-gray-100 rounded-lg p-3 relative">
              <div className="absolute top-0 left-0 w-full h-6 bg-gray-300 flex items-center px-2">
                <div className="w-4 h-4 rounded-full bg-red-600 mr-1" />
                <div className="text-xs font-bold text-gray-700">
                  Nintendo DS
                </div>
              </div>
              {/* Nintendo DS Pokémon display area */}
              <div className="pt-6 flex-col items-center justify-center h-68">
                {/* Lógica pokémon */}
              </div>
            </div>
          </div>
          {/* Speakers */}
          <div className="absolute bottom-1 left-10">
            <div className="flex spacing-x-1">
              {[...Array(3)].map((_, index) => (
                <div
                  className="w-1 h-4 bg-gray-600 rounded-full"
                  key={index}
                ></div>
              ))}
            </div>
          </div>
          <div className="absolute bottom-1 right-10">
            <div className="flex spacing-x-1">
              {[...Array(3)].map((_, index) => (
                <div
                  className="w-1 h-4 bg-gray-600 rounded-full"
                  key={index}
                ></div>
              ))}
            </div>
          </div>
        </div>
        {/* Hinge */}
        <div className="h-4 bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700 relative z-10 shadow-md">
          <div className="absolute left-6 top-1 w-6 h-2 bg-gray-800 rounded-full" />
          <div className="absolute right-6 top-1 w-6 h-2 bg-gray-800 rounded-full" />
        </div>
        {/* telinha de baixo */}
        <div className="bg-gray-800 rounded-b-3xl p-4 pt-6 relative shadow-lg border-8 border-gray-700">
          {/* telinha em si */}
          <div className="bg-gray-900 rounded-xl p-1 relative overflow-hidden">
            {/* touch screen */}
            <div className="bg-gray-100 rounded-lg p-3">
              <div className="overflow-y-auto h-56 pr-1 scrollbar-thin scrollbar-thumb-blue-500">
                <div className="grid grid-cols-2 gap-2">
                  {pokemons.map((p, index) => (
                    <div
                      key={index}
                      className="relative bg-gradient-to-r from-red-100 to-red-200 p-2 rounded-lg border-2 border-red-300 shadow-sm flex flex-col items-center hover:from-red-200 hover:to-red-300 transition-all cursor-pointer h-20 justify-between"
                    >
                      <h3 className="text-sm font-semibold capitalize text-red-800 truncate w-full text-center">
                        {p.name}
                      </h3>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          {/* controles */}
          <div className="absolute bottom-6 left-6">
            <div className="h-16 w-16 relative">
              <div className="absolute top-0 left-5 w-6 h-6 bg-gray-900 rounded-sm" />
              <div className="absolute top-5 left-0 w-6 h-6 bg-gray-900 rounded-sm" />
              <div className="absolute top-5 left-10 w-6 h-6 bg-gray-900 rounded-sm" />
              <div className="absolute top-10 left-5 w-6 h-6 bg-gray-900 rounded-sm" />
              <div className="absolute top-5 left-5 w-6 h-6 bg-gray-900 rounded-sm" />
            </div>
          </div>
          {/* botões */}
          <div className="absolute bottom-6 right-6">
            <div className="flex flex-col items-center">
              <div className="w-5 h-5 bg-green-500 rounded-full mb-1" />
              <div className="flex space-x-1">
                <div className="w-5 h-5 bg-yellow-500 rounded-full" />
                <div className="w-5 h-5 bg-red-500 rounded-full" />
                <div className="w-5 h-5 bg-blue-500 rounded-full" />
              </div>
            </div>
          </div>
          {/* start select */}
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-4">
            <div className="w-8 h-2 bg-gray-600 rounded-full" />
            <div className="w-8 h-2 bg-gray-600 rounded-full" />
          </div>
        </div>
      </div>

      {/* <button
        onClick={() => {
          setNumero(numero + 1);
        }}
      >
        {numero}
      </button>
      <button
        onClick={() => {
          setCount(numero + 1);
        }}
      >
        {count}
      </button> */}

      {/* listar pokémon da lista */}

      {/* index sendo id fixo */}
      {/* loading está true? então está carregando, senão ele mostra a lista */}
    </div>
  );
}

export default App;

// {loadingPokemons ? (
//   <div>Está carregando.</div>
// ) : (
//   pokemons.map((pokemon, index) => {
//     {
//       /* afirmando que talvez não exista pokemon.name, colocando outra coisa no lugar, fazendo com que nunca quebre*/
//     }
//     return (
//       <div key={index}>
//         <p className="font-bold px-12">{pokemon?.name ?? ""}</p>
//       </div>
//     );
//   })
// )}
