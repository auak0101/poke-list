import React, { useState, useEffect, useActionState } from 'react';
import Item from './components/Item';
import List from './components/List';
import Search from './components/Search';
import useSemiPersistentState from './hooks/useSemiPersistentState';

import styles from './App.module.css'; // Importe o CSS Module
import './index.css'


// Action para simular a adição de uma story no banco de dados
async function addStoryAction(prevState, formData) {
  const title = formData.get('title');
  const author = formData.get('author');

  console.log("Simulando adição de story: ", { title, author });


  await new Promise(resolve => setTimeout(resolve, 1000));


  if (!title || !author) {
    return { success: false, message: 'Título e autor são obrigatórios!' };
  }
  return { success: true, message: `Story '${title}' adicionada com sucesso!` };
}

function App() {
   const [searchTerm, setSearchTerm] = useSemiPersistentState(
    'searchTerm' || ''
  );


  const [stories, setStories] = useState([]);          // estados das stories
  const [isLoading, setIsLoading] = useState(false);  // estado de carregamento
  const [isError, setIsError] = useState(false);      // estado de erro

  const [submissionState, submissionStoryAction] = useActionState(addStoryAction, null);

  const handleChange = (event) => {
    setSearchTerm(event.target.value);
  };

  // salva o termo de pesquisa no cache do navegador
  useEffect(() => {
    localStorage.setItem('searchTerm', searchTerm);
  }, [searchTerm]);


  // efeito para buscar dados da API
  useEffect(() => {
    setIsLoading(true); // carregando = true
    setIsError(false); // diz que por agora não há erro

    fetch(`https://pokeapi.co/api/v2/pokemon?limit=20&offset=0`)
      .then(response => response.json())
      .then(async result => {
        const pokemonList = result.results.map(pokemon => {
          const id = pokemon.url.split('/').slice(-2, -1)[0];
          return {
            id: id,
            name: pokemon.name,
           // imagemUrl: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`,
             imagemUrl: `https://raw.githubusercontent.com/PokeAPI/sprites/refs/heads/master/sprites/pokemon/other/showdown/${id}.gif`,
            url: pokemon.url
          };

        });
        setStories(pokemonList);
        setIsLoading(false);
      })

      
      .catch(() => { // caso haja algum erro:
        setIsError(true);   // define o estado de erro
        setIsLoading(false); // finaliza o carregamento
      })
  }, [searchTerm])

  // Com verificação de erro
  const filteredList = stories.filter(function (item) {
    const title = (item && (item.title || item.story_title) || '').toLowerCase();
    return title.includes(searchTerm.toLowerCase());
  }
  );

  // renderizar elementos na tela
  return (
    <div className={styles.container}>
      <h1 className={styles.header}>PoKeMoNs </h1>
      <Search onSearch={handleChange} searchTerm={searchTerm} />

      <p>Mostrando resultados para "{searchTerm}"</p>

      <hr />

      {/* Se isError é true, renderizar logo em seguida o conteúdo após '&&' */}
      {isError && <p className={styles.errorMessage}>Algo deu errado ao carregar as histórias.</p>}

      {isLoading ?
        (<p className={styles.loadingMessage}>Carregando histórias...</p>) // se isLoading == true
        :
        (<List list={filteredList} />)    // se isLoading == false
      }

      <hr />

      <h2>Adicionar Novo Story</h2>
      <form action={submissionStoryAction}>
        <div>
          <label htmlFor="title">Título: </label>
          <input id="title" name="title" type="text" />
        </div>
        <div>
          <label htmlFor="author">Autor: </label>
          <input id="author" name="author" type="text" />
        </div>
        <button type="submit">Adicionar</button>
        {submissionState?.message && (
          <p style={{ color: submissionState.success ? 'green' : 'red' }}>
            {submissionState.message}
          </p>
        )}
      </form>
    </div>
  );
}

export default App;