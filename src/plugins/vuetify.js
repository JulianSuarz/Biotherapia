// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

import { createVuetify } from 'vuetify'
import { VDataTable } from 'vuetify/labs/VDataTable'
import * as components from 'vuetify/components'
import * as labsComponents from 'vuetify/labs/components'

export default createVuetify({
  components: {
    VDataTable,     ...components,
    ...labsComponents,
  },
})

