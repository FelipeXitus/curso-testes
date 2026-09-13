import conexao from '#db/singleton-connection.js';

export async function criarLivro(dadosParciais = {}) {
  const [autor] = await conexao('autores')
    .insert({
      nome: 'Autor Teste',
      nacionalidade: 'Teste',
    })
    .returning('*');

  const [editora] = await conexao('editoras')
    .insert({
      nome: 'Editora Teste',
      email: 'editora@teste.com',
      cidade: 'Cidade Teste',
    })
    .returning('*');

  const dadosLivro = {
    titulo: 'Test',
    paginas: 100,
    autor_id: autor.id,
    editora_id: editora.id,
    ...dadosParciais,
  };

  const [livro] = await conexao('livros').insert(dadosLivro).returning('*');

  return livro;
}