import { useState, useEffect } from 'react';
import axios from 'axios';
import ProfessorPage from './components/ProfessorPage';
import AlunoPage from './components/AlunoPage';

function App() {
  const [userType, setUserType] = useState(null); // 'professor' ou 'aluno'
  const [loggedIn, setLoggedIn] = useState(false);
  const [senha, setSenha] = useState('');
  const [turmaSelecionada, setTurmaSelecionada] = useState('');
  const [nomeAluno, setNomeAluno] = useState('');
  const [imageURL, setImageURL] = useState(null);
  const [salas, setSalas] = useState({});

  useEffect(() => {
    async function fetchImage() {
      try {
        const res = await axios.get('http://localhost:3001/imagem');
        if (res.data?.url) {
          setImageURL(res.data.url);
        }
      } catch (err) {
        console.error('Erro ao buscar imagem:', err);
      }
    }
    fetchImage();
  }, []);

  const handleLogin = () => {
    if (userType === 'aluno') {
      const sala = salas[turmaSelecionada];
      if (sala && sala.senha === senha) {
        if (!sala.alunos.some((a) => a.nome === nomeAluno)) {
          setSalas((prev) => ({
            ...prev,
            [turmaSelecionada]: {
              ...prev[turmaSelecionada],
              alunos: [
                ...prev[turmaSelecionada].alunos,
                { nome: nomeAluno, entregou: false }
              ]
            }
          }));
        }
        setLoggedIn(true);
      } else {
        alert('Senha incorreta ou sala inexistente');
      }
    } else if (userType === 'professor') {
      setLoggedIn(true);
    }
  };

  const handleLogout = () => {
    setUserType(null);
    setLoggedIn(false);
    setSenha('');
    setTurmaSelecionada('');
    setNomeAluno('');
    setImageURL(null);
  };

  const handleCreateRoom = () => {
    if (turmaSelecionada && senha) {
      if (salas[turmaSelecionada]) {
        alert('Essa sala já existe.');
        return;
      }

      setSalas((prev) => ({
        ...prev,
        [turmaSelecionada]: {
          senha,
          alunos: []
        }
      }));
      setLoggedIn(true);
    } else {
      alert('Preencha o nome da sala e a senha');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
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

          {userType === 'professor' && (
            <div className="space-y-2">
              <input
                type="text"
                placeholder="Nome da nova sala"
                value={turmaSelecionada}
                onChange={(e) => setTurmaSelecionada(e.target.value)}
                className="w-full p-2 border"
              />
              <input
                type="password"
                placeholder="Defina uma senha para a sala"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                className="w-full p-2 border"
              />
              <button
                onClick={handleCreateRoom}
                className="w-full bg-blue-600 text-white p-2 rounded"
              >
                Criar Sala
              </button>
            </div>
          )}

          {userType === 'aluno' && (
            <>
              <select
                value={turmaSelecionada}
                onChange={(e) => setTurmaSelecionada(e.target.value)}
                className="w-full p-2 border"
              >
                <option value="">Selecione a turma</option>
                {Object.keys(salas).map((turma) => (
                  <option key={turma} value={turma}>
                    {turma}
                  </option>
                ))}
              </select>

              <input
                type="text"
                placeholder="Digite seu nome"
                value={nomeAluno}
                onChange={(e) => setNomeAluno(e.target.value)}
                className="w-full p-2 border"
              />

              <input
                type="password"
                placeholder="Digite a senha"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                onKeyDown={handleKeyPress}
                className="w-full p-2 border"
              />

              <button
                onClick={handleLogin}
                className="w-full bg-green-600 text-white p-2 rounded"
              >
                Entrar
              </button>
            </>
          )}
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm">
              Logado como: {userType === 'professor' ? 'Professor' : `Aluno - ${nomeAluno} (${turmaSelecionada})`}
            </span>
            <button
              onClick={handleLogout}
              className="text-red-600 hover:underline text-sm"
            >
              Sair
            </button>
          </div>

          {userType === 'professor' && (
            <ProfessorPage
              imageURL={imageURL}
              salas={salas}
              turmaSelecionada={turmaSelecionada}
            />
          )}
          {userType === 'aluno' && (
            <AlunoPage
              imageURL={imageURL}
              nomeAluno={nomeAluno}
              turmaSelecionada={turmaSelecionada}
              salas={salas}
              setSalas={setSalas}
            />
          )}
        </>
      )}
    </div>
  );
}

export default App;
