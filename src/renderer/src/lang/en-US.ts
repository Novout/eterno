export default {
  menu: {
    historic: 'Historic',
    configuration: {
      title: 'Configuration',
      preferences: {
        title: 'Preferences',
        language: {
          title: 'Language',
          description: 'Choose browser language.'
        },
        searchProvider: {
          title: 'Search Provider',
          description:
            "Choose the search provider. All your navigation through the search bar will use this provider unless it's a link or a file."
        },
        noticesInHomePage: {
          title: 'Notices in Home Page',
          description: 'Enable news feeds to load at the start of a new tab.',
          link: {
            title: 'Home page link',
            description: 'Change the home page link.'
          }
        }
      },
      defines: {
        title: 'Defines',
        saveLocalData: {
          title: 'Save local data',
          description: 'Save your browsing data and initialize it when you open the browser.'
        },
        deleteLocalData: {
          title: 'Delete local data',
          description: 'Delete all browser saved data on your computer.',
          delete: 'Delete'
        }
      }
    }
  },
  views: {
    default: {
      title: 'New tab',
      search: 'New tab'
    }
  },
  default: {
    title: 'Eterno.',
    description: 'A lightweight browser.',
    placeholder: 'Look for something that interests you...'
  },
  profile: {
    conquests: 'Conquests'
  },
  download: {
    title: 'Download'
  },
  toast: {
    errorInInitializeData:
      'An error occurred while loading your browser local data. Please consider restarting your browser.',
    successInDownload: 'The file was downloaded successfully!',
    cancelInDownload: 'Download has been canceled!',
    errorInOpenFolder: 'Error in Open Folder!',
    warningInDuplicateDownload:
      'The selected file is already being downloaded. The operation has been canceled.',
    successInDeleteData: 'Data deleted successfully!'
  }
}
