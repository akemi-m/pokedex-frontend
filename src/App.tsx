import { useEffect, useMemo, useState } from "react";
import "./App.css";
import toast, { Toaster } from "react-hot-toast";
import { Pokemon } from "./interfaces/pokemon.interface";

interface PokemonShiny {
  name: string;
  url: string;
  shinyImage: string;
  id: number;
  types: string[];
}

interface PokemonDetails {
  name: string;
  id: number;
  imagem: string;
  type: string[];
  url: string;
}

function App() {
  // armazenar pokémon que tem name e url - lista de pokémon
  // pokemons é uma estante vazia e setPokemons é a pessoa que pega o livro e põe na estante (atualiza o estado, função)
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [pokemonsShiny, setPokemonsShiny] = useState<PokemonShiny[]>([]);

  // estado novo: pokémon selecionado, pode ser null, sendo o estado inicial null
  const [selectedPokemon, setSelectedPokemon] = useState<PokemonDetails | null>(
    null
  );

  const [selectedShinyPokemon, setSelectedShinyPokemon] =
    useState<PokemonShiny | null>(null);

  const [meusPokemons, setMeusPokemons] = useState<Pokemon[]>([]);

  // bool falso, sendo essa a tipagem
  const [, setLoadingPokemons] = useState(false);

  const [searchTerm, setSearchTerm] = useState<string>("");

  const [quantidadePokemon, setQuantidadePokemon] = useState<number>(20);

  const [isShinyList, setIsShinyList] = useState<boolean>(false);

  // const [numero, setNumero] = useState(0);
  // const [count, setCount] = useState<number>(() => {
  //   const savedCount = localStorage.getItem("count");
  //   return savedCount ? Number(savedCount) : 0;
  // });

  // useEffect(() => {
  //   localStorage.setItem("count", count.toString());
  // }, [count]);

  // lifecicle - hook
  const getPokemons = async () => {
    fetch(`http://localhost:3000/pokemon-list?limit=${quantidadePokemon}`)
      .then((res) => res.json())
      .then((data) => {
        // data é a listagem de pokémon - gravar em um estado da tela

        // colocar os pokémons da lista dentro da variável pokemons
        setPokemons(data);
        // terminou de carregar já
        setLoadingPokemons(false);

        getPokemonMyFavoriteList();
      });
  };
  useEffect(() => {
    // tela começa aqui
    getPokemons();
    // loading começou
    setLoadingPokemons(true);

    return () => {
      // return quando a tela morre
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quantidadePokemon]); // quando dependência muda - exemplo, colocar uma ref ou botão, quando acontecer algo cai no useEffect
  console.log(pokemons);
  // o que o usuário vê

  // função mais leve
  const getPokemonDetails = async (name: string) => {
    try {
      const res = await fetch(`http://localhost:3000/pokemon-detail/${name}`);
      const data: PokemonDetails = await res.json();
      setSelectedPokemon(data);
    } catch (error) {
      console.log(error);
    }
  };

  const getPokemonMyFavoriteList = async () => {
    try {
      const res = await fetch("http://localhost:3000/pokemon-save");
      if (res.ok) {
        const data = await res.json();
        setMeusPokemons(data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const pokeballStyles = useMemo(() => {
    return [...Array(40)].map(() => ({
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      animationDuration: `${5 + Math.random() * 1}s`,
      animationDelay: `${Math.random() * 1}s`,
    }));
  }, []);

  const isFavorite = meusPokemons.some(
    (pf) => pf.name === selectedPokemon?.name
  );

  const favoritePokemon = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    try {
      const res = await fetch("http://localhost:3000/pokemon-save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: selectedPokemon?.name,
          url: selectedPokemon?.url,
        }),
      });
      if (res.ok) {
        getPokemonMyFavoriteList();
        toast.success(`${selectedPokemon?.name} favoritado com sucesso.`, {
          style: {
            background: "#10b981",
            color: "#ffffff",
            borderRadius: "8px",
            padding: "16px",
          },
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const deletarPokemon = async () => {
    try {
      const res = await fetch(
        `http://localhost:3000/pokemon-delete/${selectedPokemon?.name}`,
        {
          method: "DELETE",
        }
      );
      if (res.ok) {
        getPokemonMyFavoriteList();
        toast.error(`${selectedPokemon?.name} removido com sucesso.`, {
          style: {
            background: "#b91010",
            color: "#ffffff",
            borderRadius: "8px",
            padding: "16px",
          },
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  // vendo se na lista de pokémons existe o pokémon
  const filteredPokemon = pokemons.filter((pokemon) =>
    pokemon.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getPokemonShiny = async () => {
    try {
      const res = await fetch("http://localhost:3000/shiny-pokemon-list");
      if (res.ok) {
        const data = await res.json();
        setPokemonsShiny(data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (isShinyList) {
      setSelectedPokemon(null);
      getPokemonShiny();
    } else {
      setSelectedShinyPokemon(null);
      getPokemons();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isShinyList]);

  const verifySelected = selectedPokemon || selectedShinyPokemon;

  return (
    <div className="min-h-screen bg-gradient-to-b flex justify-center items-center p-4">
      <Toaster position="top-right" reverseOrder={false} />
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

                {/* verificou se o selectedpokemon existe, se não, não vai renderizar */}

                {verifySelected ? (
                  <div className="text-center h-full flex items-center justify-center">
                    <div className="bg-gradient-to-b from-blue-100 to-blue-200 p-3 rounded-xl border-2 border-blue-400 shadow-md w-54">
                      {selectedShinyPokemon === null && isFavorite && (
                        <div className=" text-yellow-500 text-lg">★</div>
                      )}
                      <h2 className="text-xl font-bold capitalize text-blue-800 truncate">
                        {selectedShinyPokemon?.name ?? selectedPokemon?.name}
                      </h2>
                      <p className="text-sm text-blue-600 font-medium">
                        {/* colocar dois 0 na frente do número */}#
                        {selectedShinyPokemon?.id.toString().padStart(3, "0") ??
                          selectedPokemon?.id.toString().padStart(3, "0")}
                      </p>
                      <img
                        src={
                          selectedShinyPokemon?.shinyImage ??
                          selectedPokemon?.imagem
                        }
                        alt={verifySelected?.name}
                        className="mx-auto w-24 h-24 object-contain"
                      />
                      <div className="flex justify-center gap-1 mb-1 flex-wrap">
                        {selectedPokemon?.type.map((type) => (
                          <span
                            key={type}
                            className="px-2 py-0.5 text-xs font-bold text-white bg-blue-600 rounded-full"
                          >
                            {type}
                          </span>
                        ))}
                      </div>
                      {selectedShinyPokemon === null &&
                        (isFavorite ? (
                          <button
                            onClick={() => deletarPokemon()}
                            className="bg-red-600 text-white px-2 py-0.5 rounded text-xs hover:bg-red-900 transition-colors mt-1 cursor-pointer"
                          >
                            Remover Pokémon
                          </button>
                        ) : (
                          <button
                            onClick={(e) => favoritePokemon(e)}
                            className="bg-yellow-500 text-white px-2 py-0.5 rounded text-xs hover:bg-yellow-900 transition-colors mt-1 cursor-pointer"
                          >
                            Favoritar Pokémon
                          </button>
                        ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center h-full flex flex-col items-center justify-center">
                    <div className="w-24 h-24 bg-red-600 rounded-full mx-auto mb-2 border-4 border-white flex items-center justify-center">
                      <div className="w-10 h-10 bg-white rounded-full" />
                    </div>
                    <p className="text-gray-700 font-medium">
                      Selecione um Pokémon
                    </p>
                  </div>
                )}
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
              <div className="relative">
                <input
                  type="text"
                  placeholder="Pesquisar Pokémon"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full p-2 pl-8 border-2 border-blue-400 rounded-lg text-sm bg-white shadow-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-600 "
                />
                <div className="absolute left-2 top-2.5">
                  <svg
                    className="w-4 h-4 text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    ></path>
                  </svg>
                </div>
              </div>
              <div className="overflow-y-auto h-56 pr-1 scrollbar-thin scrollbar-thumb-blue-500">
                <div className="grid grid-cols-2 gap-2">
                  {isShinyList
                    ? pokemonsShiny.map((p, index) => {
                        return (
                          <div
                            key={index}
                            onClick={() => {
                              setSelectedShinyPokemon(p);
                            }}
                            className="relative bg-gradient-to-r from-yellow-100 to-yellow-200 p-2 rounded-lg border-2 border-yellow-300 shadow-sm flex flex-col items-center hover:from-yellow-200 hover:to-yellow-300 transition-all cursor-pointer justify-between"
                          >
                            <h3 className="text-sm font-semibold capitalize text-yellow-800 truncate w-full text-center">
                              {p.name}
                            </h3>
                          </div>
                        );
                      })
                    : filteredPokemon.map((p, index) => {
                        return (
                          <div
                            key={index}
                            onClick={() => {
                              getPokemonDetails(p.name);
                            }}
                            className="relative bg-gradient-to-r from-red-100 to-red-200 p-2 rounded-lg border-2 border-red-300 shadow-sm flex flex-col items-center hover:from-red-200 hover:to-red-300 transition-all cursor-pointer justify-between"
                          >
                            <h3 className="text-sm font-semibold capitalize text-red-800 truncate w-full text-center">
                              {p.name}
                            </h3>
                          </div>
                        );
                      })}
                </div>
              </div>
            </div>
          </div>
          {/* controles */}
          <div className="absolute bottom-6 left-6">
            <div className="h-16 w-16 relative">
              <div
                className="absolute top-0 left-5 w-6 h-6 bg-yellow-900 rounded-sm"
                onClick={() => {
                  // ele nunca vai ser ele mesmo, se tiver true, vai virar false e vice versa
                  setIsShinyList(!isShinyList);
                }}
              />
              <div className="absolute top-5 left-0 w-6 h-6 bg-gray-900 rounded-sm" />
              <div className="absolute top-5 left-10 w-6 h-6 bg-gray-900 rounded-sm" />
              <div
                className="absolute top-10 left-5 w-6 h-6 bg-blue-500 rounded-sm cursor-pointer"
                onClick={() => setQuantidadePokemon(quantidadePokemon + 20)}
              />
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
