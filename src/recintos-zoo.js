class RecintosZoo {
  constructor() {
    this.recintos = [
      { id: 1, bioma: 'savana', total: 10, ocupados: 3, animais: ['MACACO'] },
      { id: 2, bioma: 'floresta', total: 5, ocupados: 0, animais: [] },
      { id: 3, bioma: 'savana e rio', total: 7, ocupados: 2, animais: ['GAZELA'] },
      { id: 4, bioma: 'rio', total: 8, ocupados: 0, animais: [] },
      { id: 5, bioma: 'savana', total: 9, ocupados: 3, animais: ['LEAO'] }
    ];

    this.animais = {
      LEAO: { tamanho: 3, biomas: ['savana'], carnivoro: true },
      LEOPARDO: { tamanho: 2, biomas: ['savana'], carnivoro: true },
      CROCODILO: { tamanho: 3, biomas: ['rio'], carnivoro: true },
      MACACO: { tamanho: 1, biomas: ['savana', 'floresta'], carnivoro: false },
      GAZELA: { tamanho: 2, biomas: ['savana'], carnivoro: false },
      HIPOPOTAMO: { tamanho: 4, biomas: ['savana', 'rio'], carnivoro: false }
    };
  }

  recintoTemCarnivoros(recinto) {
    return recinto.animais.some(animal => this.animais[animal].carnivoro);
  }

  analisaRecintos(animal, quantidade) {
    // Validações
    if (!this.animais[animal]) {
      return { erro: "Animal inválido" };
    }
  
    if (!Number.isInteger(quantidade) || quantidade <= 0) {
      return { erro: "Quantidade inválida" };
    }
  
    const tamanhoAnimal = this.animais[animal].tamanho * quantidade;
    const biomasValidos = this.animais[animal].biomas;
    const carnivoro = this.animais[animal].carnivoro;
    const recintosViaveis = [];
  
    this.recintos.forEach(recinto => {
      const espacoDisponivel = recinto.total - recinto.ocupados;
  
      console.log(`Verificando Recinto ${recinto.id}:`);
      console.log(`Espaço disponível: ${espacoDisponivel}, Animal: ${animal}, Tamanho Necessário: ${tamanhoAnimal}`);
  
      // Verifica se o bioma é adequado
      if (!biomasValidos.includes(recinto.bioma)) {
          console.log(`Recinto ${recinto.id} descartado: Bioma inadequado`);
          return;
      }
  
      // Verifica se o espaço disponível é suficiente
      if (espacoDisponivel < tamanhoAnimal) {
          console.log(`Recinto ${recinto.id} descartado: Espaço insuficiente`);
          return;
      }
  
      // Verifica se há outros carnívoros no recinto
      if (!carnivoro && this.recintoTemCarnivoros(recinto)) {
          console.log(`Recinto ${recinto.id} descartado: Não pode misturar com carnívoros`);
          return;
      }
  
      // Regra de coexistência para espécies diferentes
      let espacoNecessario = tamanhoAnimal;
      if (recinto.animais.length > 0 && !recinto.animais.includes(animal)) {
          espacoNecessario += 1; // Espaço extra para coexistência
          console.log(`Espaço ajustado para coexistência: ${espacoNecessario}`);
      }
  
      // Verifica novamente se o espaço disponível é suficiente após a coexistência
      if (espacoDisponivel < espacoNecessario) {
          console.log(`Recinto ${recinto.id} descartado: Espaço insuficiente após coexistência`);
          return;
      }
  
      console.log(`Recinto ${recinto.id} é viável: Espaço necessário = ${espacoNecessario}`);
  
      // Adiciona o recinto viável
      recintosViaveis.push({
          id: recinto.id,
          espacoLivre: espacoDisponivel - espacoNecessario,
          espacoTotal: recinto.total
      });
  });
  
    // Verifica se encontrou recintos viáveis
    if (recintosViaveis.length === 0) {
      return { erro: "Não há recinto viável" };
    }

    // Se o animal for carnívoro, retorne apenas o primeiro recinto viável com espaço suficiente.
    if (carnivoro) {
      return {
        recintosViaveis: recintosViaveis
          .map(r => `Recinto ${r.id} (espaço livre: ${r.espacoLivre} total: ${r.espacoTotal})`)
      };
    }
  
    // Para animais não carnívoros, retornar todos os recintos viáveis ordenados.
    const recintosViaveisOrdenados = recintosViaveis.sort((a, b) => b.espacoLivre - a.espacoLivre);
  
    return {
      recintosViaveis: recintosViaveisOrdenados
        .map(r => `Recinto ${r.id} (espaço livre: ${r.espacoLivre} total: ${r.espacoTotal})`)
    };
  }
}

export { RecintosZoo as RecintosZoo };
