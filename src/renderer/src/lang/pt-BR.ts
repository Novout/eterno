export default {
  menu: {
    historic: 'Histórico',
    configuration: {
      title: 'Configuração',
      preferences: {
        title: 'Preferencias',
        language: {
          title: 'Linguagem',
          description: 'Escolha a linguagem do navegador.'
        },
        searchProvider: {
          title: 'Provedor de Pesquisa',
          description:
            'Escolha o provedor de pesquisa. Todas as suas navegações pela barra de pesquisa utilizarão esse provedor caso não seja um link ou um arquivo.'
        },
        noticesInHomePage: {
          title: 'Notícias na pagina principal',
          description: 'Habilitar os carregamentos de notícias no início de uma nova aba.',
          link: {
            title: 'Link da página principal',
            description: 'Troque o link da página principal.'
          }
        }
      },
      defines: {
        title: 'Defines',
        saveLocalData: {
          title: 'Salvar dados localmente',
          description: 'Guardar seus dados de navegação e inicializá-los quando abrir o browser.'
        }
      }
    }
  },
  views: {
    default: {
      title: 'Nova guia',
      search: 'Nova guia'
    }
  },
  default: {
    title: 'Eterno.',
    description: 'Um navegador leve.',
    placeholder: 'Procure algo de seu interesse...'
  },
  profile: {
    conquests: 'Conquistas'
  },
  download: {
    title: 'Download'
  },
  toast: {
    errorInInitializeData:
      'Ocorreu algum erro ao carregar os dados locais do navegador. Por favor, considere reiniciar o navegador.',
    successInDownload: 'O arquivo foi baixado com sucesso!',
    cancelInDownload: 'O download foi cancelado!',
    errorInOpenFolder: 'Erro ao abrir o arquivo!',
    warningInDuplicateDownload:
      'O arquivo escolhido ja está sendo baixado. A operação foi cancelada.'
  }
}
