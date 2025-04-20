import { useState,useEffect } from 'react';
import { } from 'react';
import axios from 'axios';
import ImageUpload from './components/ImageUpload';
import EssayForm from './components/EssayForm';

const TURMA_SENHAS = {
  turmaA: 'alunoA',
  turmaB: 'alunoB',
  turmaC: 'alunoC',
};

function App() {
  useEffect(() => {
    async function fetchImage() {
      const res = await axios.get('http://localhost:3001/imagem');
      if (res.data?.url) {
        setImageURL(res.data.url);
      }
    }
    fetchImage();
  }, []);
  
  const [userType, setUserType] = useState(null); // 'professor' ou 'aluno'
  const [loggedIn, setLoggedIn] = useState(false);
  const [senha, setSenha] = useState('');
  const [turmaSelecionada, setTurmaSelecionada] = useState('');
  const [imageURL, setImageURL] = useState(null);

  const handleLogin = () => {
    if (userType === 'professor' && senha === 'prof123') {
      setLoggedIn(true);
    } else if (userType === 'aluno' && TURMA_SENHAS[turmaSelecionada] === senha) {
      setLoggedIn(true);
    } else {
      alert('Senha incorreta');
    }
  };

  const handleLogout = () => {
    setUserType(null);
    setLoggedIn(false);
    setSenha('');
    setTurmaSelecionada('');
    setImageURL(null);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto font-sans">
      <h1 className="text-2xl font-bold mb-4 text-center">Ambiente de Redação</h1>

      {!loggedIn ? (
        <div className="space-y-4">
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => setUserType('professor')}
              className={`px-4 py-2 rounded ${
                userType === 'professor' ? 'bg-blue-600 text-white' : 'bg-gray-200'
              }`}
            >
              Professor
            </button>
            <button
              onClick={() => setUserType('aluno')}
              className={`px-4 py-2 rounded ${
                userType === 'aluno' ? 'bg-green-600 text-white' : 'bg-gray-200'
              }`}
            >
              Aluno
            </button>
          </div>

          {userType === 'aluno' && (
            <select
              value={turmaSelecionada}
              onChange={(e) => setTurmaSelecionada(e.target.value)}
              className="w-full p-2 border"
            >
              <option value="">Selecione a turma</option>
              <option value="turmaA">Turma A</option>
              <option value="turmaB">Turma B</option>
              <option value="turmaC">Turma C</option>
            </select>
          )}

          <input
            type="password"
            placeholder="Digite a senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            className="w-full p-2 border"
          />

          <button
            onClick={handleLogin}
            className="w-full bg-blue-500 text-white p-2 rounded"
          >
            Entrar
          </button>
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm">
              Logado como: {userType === 'professor' ? 'Professor' : `Aluno - ${turmaSelecionada}`}
            </span>
            <button
              onClick={handleLogout}
              className="text-red-600 hover:underline text-sm"
            >
              Sair
            </button>
          </div>

          {userType === 'professor' && (
            <ImageUpload onUpload={setImageURL} />
          )}

          {imageURL && (
            <>
              <img
                src={imageURL}
                alt="Imagem enviada pelo professor"
                className="my-4 rounded-lg shadow-md w-full max-h-[400px] object-contain"
              />
              <EssayForm />
            </>
          )}

          {userType === 'aluno' && !imageURL && (
            <p className="text-center text-gray-600">Aguardando o professor enviar a imagem...</p>
          )}
        </>
      )}
    </div>
  );
}

export default App;
 
