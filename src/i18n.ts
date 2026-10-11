import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  pt: {
    translation: {
      nav: {
        home: 'Início',
        about: 'Sobre',
        sources: 'Dados',
        analyses: 'Análises',
        dashboard: 'Dashboard',
        contact: 'Contato',
        change_language: 'Idioma',
        menu_open: 'Abrir menu',
        menu_close: 'Fechar menu',
        theme_toggle: 'Alternar tema',
      },
      hero: {
        badge: 'DADOS PÚBLICOS ATIVOS',
        title_pre: 'EducaData',
        description:
          'Projeto de análise dos dados abertos da educação básica brasileira: Censo Escolar, SAEB/IDEB e indicadores de fluxo escolar, transformados em leitura simples para gestores, professores e pesquisadores.',
        cta_primary: 'Explorar indicadores',
        cta_secondary: 'Ver metodologia',
        scroll: 'Role para o lado',
        panel_title: 'PAINEL DE INDICADORES',
        panel_note: 'Fonte: INEP — Censo Escolar e SAEB (2019–2023)',
        stats: {
          schools: 'ESCOLAS DE EDUCAÇÃO BÁSICA',
          enrollments: 'MATRÍCULAS NA REDE PÚBLICA',
          ideb: 'IDEB ANOS INICIAIS (NACIONAL)',
        },
        chart_title: 'IDEB ANOS INICIAIS — SÉRIE HISTÓRICA',
        chart_history: 'Observado',
        chart_projection: 'Projeção',
      },
      about: {
        tag: 'SOBRE O PROJETO',
        title: 'Dados educacionais que viram decisão',
        subtitle:
          'Nasceu como trabalho de análise de dados abertos e virou uma plataforma de leitura da educação pública brasileira — do registro bruto do Censo Escolar ao indicador interpretável.',
        cards: [
          {
            label: 'FONTE',
            title: 'Censo Escolar + SAEB',
            description:
              'Microdados oficiais do INEP, de 2019 a 2023, cobrindo as 27 unidades federativas e as redes municipal, estadual e federal.',
          },
          {
            label: 'MÉTODO',
            title: 'Pipeline aberto e reprodutível',
            description:
              'Coleta, limpeza, modelagem e visualização versionadas em código — qualquer número publicado aqui pode ser recalculado.',
          },
        ],
        mission_title: 'OBJETIVO',
        mission_text:
          'Traduzir bases educacionais extensas e técnicas em indicadores compreensíveis sobre infraestrutura, aprendizagem, fluxo escolar e equidade, apoiando a gestão pública baseada em evidência.',
        alert: 'Bases tratadas: 6 anos de microdados · 5,4 mil municípios · 25 mil escolas na amostra analisada.',
        checklist: [
          'Somente dados públicos e agregados — nenhum dado pessoal de estudante',
          'Comparações sempre por etapa de ensino, rede e região',
          'Código, dicionário de variáveis e limitações documentados',
        ],
      },
      sources: {
        tag: 'FONTES E FERRAMENTAS',
        title: 'De onde vêm os dados',
        subtitle:
          'Todo indicador da plataforma é rastreável até a base de origem — e cada etapa do tratamento está descrita na metodologia.',
        items: {
          censo: {
            title: 'Censo Escolar',
            description:
              'Número de escolas, matrículas, turmas, docentes e infraestrutura declarados anualmente por todas as redes de ensino.',
          },
          saeb: {
            title: 'SAEB e IDEB',
            description:
              'Proficiência em Língua Portuguesa e Matemática e o índice que combina aprendizagem com fluxo escolar.',
          },
          ibge: {
            title: 'IBGE e território',
            description:
              'População, urbanização e recortes regionais usados para normalizar taxas e comparar realidades diferentes.',
          },
          stack: {
            title: 'Stack de análise',
            description:
              'Python e R para o tratamento, SQL/SQLite para persistência e React + TypeScript para publicar os resultados na web.',
          },
        },
        tech_title: 'TECNOLOGIAS',
        techs: ['Python', 'pandas', 'R', 'dplyr', 'SQL', 'SQLite', 'React', 'TypeScript'],
      },
      analyses: {
        tag: 'ANÁLISES',
        title: 'O que os dados mostram',
        subtitle:
          'Seis recortes do Censo Demográfico 2022 (IBGE) — cada card traz o indicador principal e o que ele significa na prática.',
        items: {
          alfabetizacao: {
            title: 'Alfabetização (15+)',
            description:
              'Cerca de 93% das pessoas de 15 anos ou mais sabem ler e escrever — a taxa cai entre os mais velhos e nas populações indígena e preta.',
          },
          escolarizacao_pcd: {
            title: 'Escolarização com deficiência',
            description:
              'Entre 6 e 14 anos, 92,6% das pessoas com deficiência frequentam a escola — a inclusão encolhe muito depois dessa idade.',
          },
          deficiencia: {
            title: 'Pessoas com deficiência',
            description:
              '7,3% da população de 2 anos ou mais declara ao menos uma deficiência; a prevalência cresce com a idade.',
          },
          autismo: {
            title: 'Transtorno do espectro autista',
            description:
              '1,2% da população de 2 anos ou mais tem diagnóstico de autismo, com predominância entre homens.',
          },
          registro_nascimento: {
            title: 'Registro de nascimento',
            description:
              '99,3% das crianças de até 5 anos têm registro; entre indígenas a cobertura cai para 89%.',
          },
          idade_mediana: {
            title: 'Envelhecimento',
            description:
              'A idade mediana da população é de 35 anos e o índice de envelhecimento chega a 55, refletindo o estreitamento da base.',
          },
        },
        metric_label: 'INDICADOR SELECIONADO',
        trends: {
          up: 'indicador em destaque',
          down: 'indicador em atenção',
          flat: 'indicador estável',
        },
      },
      dashboard: {
        tag: 'PAINEL INTERATIVO',
        title: 'Panorama do Censo 2022',
        subtitle:
          'Indicadores do Censo Demográfico 2022 (IBGE) para o recorte disponível no export. Escolha um indicador para ver o valor do Brasil, comparar as localidades e a repartição interna.',
        select: 'INDICADOR',
        local_title: 'COMPARATIVO POR LOCALIDADE',
        subfilters: 'SUBFILTROS',
        locality: 'LOCALIDADE',
        axis: 'EIXO DO GRÁFICO',
        series_title: 'SÉRIE POR',
        dimensions: {
          'Idade': 'Idade',
          'Sexo': 'Sexo',
          'Cor ou raça': 'Cor ou raça',
          'Grupo de idade': 'Grupo de idade',
          'Existência de deficiência': 'Existência de deficiência',
          'Nível de instrução': 'Nível de instrução',
          'Forma de declaração da idade': 'Forma de declaração da idade',
          'Grau de dificuldade': 'Grau de dificuldade',
          'Alfabetização': 'Alfabetização',
        },
        breakdown_title: 'REPARTIÇÃO',
        loading: 'Carregando a base do Censo 2022…',
        error: 'Não foi possível carregar a base do Censo 2022.',
        source: 'Fonte: {{fonte}}. Recorte do export: Brasil, Goiás e Edealina (GO).',
        units: {
          porcento: '%',
          pessoas: 'pessoas',
          anos: 'anos',
        },
        values: {
          Total: 'Total',
          Homens: 'Homens',
          Mulheres: 'Mulheres',
          Branca: 'Branca',
          Preta: 'Preta',
          Amarela: 'Amarela',
          Parda: 'Parda',
          Indígena: 'Indígena',
          'Pessoa com deficiência': 'Pessoa com deficiência',
          'Pessoa sem deficiência': 'Pessoa sem deficiência',
        },
        indicators: {
          alfabetizacao: {
            title: 'Alfabetização (15+)',
            description: 'Proporção de pessoas de 15 anos ou mais que sabem ler e escrever.',
          },
          populacao: {
            title: 'População residente',
            description: 'Total da população residente recenseada em 2022.',
          },
          deficiencia: {
            title: 'Pessoas com deficiência',
            description: 'Percentual de pessoas de 2 anos ou mais com ao menos uma deficiência.',
          },
          escolarizacao_pcd: {
            title: 'Escolarização (6 a 14 anos)',
            description: 'Taxa de escolarização das pessoas com deficiência em idade escolar.',
          },
          autismo: {
            title: 'Transtorno do espectro autista',
            description: 'Percentual da população de 2 anos ou mais com diagnóstico de autismo.',
          },
          registro_nascimento: {
            title: 'Registro de nascimento',
            description: 'Percentual de crianças de até 5 anos com registro de nascimento.',
          },
        },
      },
      footer: {
        title: 'EducaData Brasil',
        description:
          'Landing page do projeto de análise de dados abertos da educação básica brasileira. Feito para tornar indicadores educacionais públicos acessíveis a quem decide e a quem pesquisa.',
        links_title: 'Navegação',
        sources_title: 'Fontes oficiais',
        contact_title: 'Contato',
        contact_text: 'Dúvidas, correções ou parcerias com redes de ensino:',
        author_credit: 'Desenvolvido por Manoel — Cientista de Dados',
        about_title: 'Sobre o desenvolvedor',
        about_text:
          'Cientista de Dados apaixonado por transformar dados abertos da educação em algo que qualquer pessoa consiga ler. O EducaData nasceu da vontade de aproximar quem decide em uma rede de ensino dos números que descrevem essa rede.',
        sources: [
          { label: 'INEP — Censo Escolar', href: 'https://www.gov.br/inep/pt-br/areas-de-atuacao/pesquisas-estatisticas-e-indicadores/censo-escolar' },
          { label: 'INEP — IDEB', href: 'https://www.gov.br/inep/pt-br/areas-de-atuacao/pesquisas-estatisticas-e-indicadores/ideb' },
        ],
        copyright: '© 2026 DS.Manoel. Todos os direitos reservados.',
        disclaimer: 'Projeto independente, sem vínculo institucional com o INEP ou o MEC.',
      },
    },
  },
  en: {
    translation: {
      nav: {
        home: 'Home',
        about: 'About',
        sources: 'Data',
        analyses: 'Insights',
        dashboard: 'Dashboard',
        contact: 'Contact',
        change_language: 'Language',
        menu_open: 'Open menu',
        menu_close: 'Close menu',
        theme_toggle: 'Toggle theme',
      },
      hero: {
        badge: 'OPEN DATA LIVE',
        title_pre: 'EducaData',
        description:
          'An analysis project on Brazil’s open basic-education data: School Census, SAEB/IDEB and school-flow indicators, turned into plain reading for managers, teachers and researchers.',
        cta_primary: 'Explore indicators',
        cta_secondary: 'See methodology',
        scroll: 'Scroll sideways',
        panel_title: 'INDICATOR PANEL',
        panel_note: 'Source: INEP — School Census and SAEB (2019–2023)',
        stats: {
          schools: 'K–12 SCHOOLS',
          enrollments: 'PUBLIC SCHOOL ENROLLMENTS',
          ideb: 'IDEB EARLY GRADES (NATIONAL)',
        },
        chart_title: 'IDEB EARLY GRADES — HISTORICAL SERIES',
        chart_history: 'Observed',
        chart_projection: 'Projection',
      },
      about: {
        tag: 'ABOUT THE PROJECT',
        title: 'Education data that turns into decisions',
        subtitle:
          'It started as an open-data assignment and became a reading platform for Brazilian public education — from the raw School Census record to an interpretable indicator.',
        cards: [
          {
            label: 'SOURCE',
            title: 'School Census + SAEB',
            description:
              'Official INEP microdata from 2019 to 2023, covering all 27 federal units and municipal, state and federal school systems.',
          },
          {
            label: 'METHOD',
            title: 'Open, reproducible pipeline',
            description:
              'Collection, cleaning, modeling and visualization are all versioned in code — every number here can be recalculated.',
          },
        ],
        mission_title: 'GOAL',
        mission_text:
          'Translate large, technical education datasets into understandable indicators on infrastructure, learning, school flow and equity, supporting evidence-based public management.',
        alert: 'Treated bases: 6 years of microdata · 5,400 municipalities · 25,000 schools in the analyzed sample.',
        checklist: [
          'Public, aggregated data only — no student personal data',
          'Comparisons always by education stage, school system and region',
          'Code, variable dictionary and limitations are documented',
        ],
      },
      sources: {
        tag: 'SOURCES & TOOLS',
        title: 'Where the data comes from',
        subtitle:
          'Every indicator on the platform is traceable back to its source base — and each treatment step is described in the methodology.',
        items: {
          censo: {
            title: 'School Census',
            description:
              'Number of schools, enrollments, classes, teachers and infrastructure reported yearly by all school systems.',
          },
          saeb: {
            title: 'SAEB and IDEB',
            description:
              'Proficiency in Portuguese and Mathematics plus the index that combines learning with school flow.',
          },
          ibge: {
            title: 'IBGE and territory',
            description:
              'Population, urbanization and regional breakdowns used to normalize rates and compare different realities.',
          },
          stack: {
            title: 'Analysis stack',
            description:
              'Python and R for processing, SQL/SQLite for persistence, and React + TypeScript to publish results on the web.',
          },
        },
        tech_title: 'TECHNOLOGIES',
        techs: ['Python', 'pandas', 'R', 'dplyr', 'SQL', 'SQLite', 'React', 'TypeScript'],
      },
      analyses: {
        tag: 'INSIGHTS',
        title: 'What the data shows',
        subtitle:
          'Six cuts from the 2022 Demographic Census (IBGE) — each card brings the headline indicator and what it means in practice.',
        items: {
          alfabetizacao: {
            title: 'Literacy (15+)',
            description:
              'Around 93% of people aged 15 or over can read and write — the rate drops among older people and in the Indigenous and Black populations.',
          },
          escolarizacao_pcd: {
            title: 'Schooling with disabilities',
            description:
              'Between ages 6 and 14, 92.6% of people with disabilities attend school — inclusion shrinks sharply after that age.',
          },
          deficiencia: {
            title: 'People with disabilities',
            description:
              '7.3% of the population aged 2 or over reports at least one disability; prevalence rises with age.',
          },
          autismo: {
            title: 'Autism spectrum disorder',
            description:
              '1.2% of the population aged 2 or over has an autism diagnosis, with a majority among men.',
          },
          registro_nascimento: {
            title: 'Birth registration',
            description:
              '99.3% of children up to 5 have a birth record; among Indigenous children coverage falls to 89%.',
          },
          idade_mediana: {
            title: 'Ageing',
            description:
              'The median age of the population is 35 and the ageing index reaches 55, reflecting a narrowing base.',
          },
        },
        metric_label: 'SELECTED INDICATOR',
        trends: {
          up: 'highlight indicator',
          down: 'attention indicator',
          flat: 'stable indicator',
        },
      },
      dashboard: {
        tag: 'INTERACTIVE DASHBOARD',
        title: '2022 Census overview',
        subtitle:
          'Indicators from the 2022 Demographic Census (IBGE) for the localities available in this export. Pick an indicator to see the national value, compare localities and its breakdown.',
        select: 'INDICATOR',
        local_title: 'COMPARISON BY LOCALITY',
        subfilters: 'SUBFILTERS',
        locality: 'LOCALITY',
        axis: 'CHART AXIS',
        series_title: 'SERIES BY',
        dimensions: {
          'Idade': 'Age',
          'Sexo': 'Sex',
          'Cor ou raça': 'Race or color',
          'Grupo de idade': 'Age group',
          'Existência de deficiência': 'Disability status',
          'Nível de instrução': 'Education level',
          'Forma de declaração da idade': 'Age reporting method',
          'Grau de dificuldade': 'Degree of difficulty',
          'Alfabetização': 'Literacy',
        },
        breakdown_title: 'BREAKDOWN',
        loading: 'Loading the 2022 Census dataset…',
        error: 'The 2022 Census dataset could not be loaded.',
        source: 'Source: {{fonte}}. Export scope: Brazil, Goiás and Edealina (GO).',
        units: {
          porcento: '%',
          pessoas: 'people',
          anos: 'years',
        },
        values: {
          Total: 'Total',
          Homens: 'Men',
          Mulheres: 'Women',
          Branca: 'White',
          Preta: 'Black',
          Amarela: 'Asian',
          Parda: 'Mixed',
          Indígena: 'Indigenous',
          'Pessoa com deficiência': 'With disability',
          'Pessoa sem deficiência': 'Without disability',
        },
        indicators: {
          alfabetizacao: {
            title: 'Literacy (15+)',
            description: 'Share of people aged 15 or over who can read and write.',
          },
          populacao: {
            title: 'Resident population',
            description: 'Total resident population counted in 2022.',
          },
          deficiencia: {
            title: 'People with disabilities',
            description: 'Share of people aged 2 or over with at least one disability.',
          },
          escolarizacao_pcd: {
            title: 'School enrollment (6–14)',
            description: 'Enrollment rate of people with disabilities at school age.',
          },
          autismo: {
            title: 'Autism spectrum disorder',
            description: 'Share of the population aged 2 or over diagnosed with autism.',
          },
          registro_nascimento: {
            title: 'Birth registration',
            description: 'Share of children up to 5 years old with a birth certificate.',
          },
        },
      },
      footer: {
        title: 'EducaData Brasil',
        description:
          'Landing page for the open-data analysis project on Brazilian basic education. Built to make public education indicators accessible to decision-makers and researchers.',
        links_title: 'Navigation',
        sources_title: 'Official sources',
        contact_title: 'Contact',
        contact_text: 'Questions, corrections or partnerships with school systems:',
        author_credit: 'Built by Manoel — Data Scientist',
        about_title: 'About the developer',
        about_text:
          'Data Scientist passionate about turning open education data into something anyone can read. EducaData was born from the wish to bring the people who decide inside a school network closer to the numbers that describe it.',
        sources: [
          { label: 'INEP — School Census', href: 'https://www.gov.br/inep/pt-br/areas-de-atuacao/pesquisas-estatisticas-e-indicadores/censo-escolar' },
          { label: 'INEP — IDEB', href: 'https://www.gov.br/inep/pt-br/areas-de-atuacao/pesquisas-estatisticas-e-indicadores/ideb' },
        ],
        copyright: '© 2026 DS.Manoel. All rights reserved.',
        disclaimer: 'Independent project, not institutionally linked to INEP or MEC.',
      },
    },
  },
  es: {
    translation: {
      nav: {
        home: 'Inicio',
        about: 'Sobre',
        sources: 'Datos',
        analyses: 'Análisis',
        dashboard: 'Panel',
        contact: 'Contacto',
        change_language: 'Idioma',
        menu_open: 'Abrir menú',
        menu_close: 'Cerrar menú',
        theme_toggle: 'Cambiar tema',
      },
      hero: {
        badge: 'DATOS PÚBLICOS ACTIVOS',
        title_pre: 'EducaData',
        description:
          'Proyecto de análisis de los datos abiertos de la educación básica brasileña: Censo Escolar, SAEB/IDEB e indicadores de flujo escolar, convertidos en una lectura simple para gestores, docentes e investigadores.',
        cta_primary: 'Explorar indicadores',
        cta_secondary: 'Ver metodología',
        scroll: 'Desplázate lateralmente',
        panel_title: 'PANEL DE INDICADORES',
        panel_note: 'Fuente: INEP — Censo Escolar y SAEB (2019–2023)',
        stats: {
          schools: 'ESCUELAS DE EDUCACIÓN BÁSICA',
          enrollments: 'MATRÍCULAS EN LA RED PÚBLICA',
          ideb: 'IDEB AÑOS INICIALES (NACIONAL)',
        },
        chart_title: 'IDEB AÑOS INICIALES — SERIE HISTÓRICA',
        chart_history: 'Observado',
        chart_projection: 'Proyección',
      },
      about: {
        tag: 'SOBRE EL PROYECTO',
        title: 'Datos educativos que se convierten en decisiones',
        subtitle:
          'Comenzó como un trabajo de análisis de datos abiertos y se convirtió en una plataforma de lectura de la educación pública brasileña — del registro bruto del Censo Escolar al indicador interpretable.',
        cards: [
          {
            label: 'FUENTE',
            title: 'Censo Escolar + SAEB',
            description:
              'Microdatos oficiales del INEP, de 2019 a 2023, cubriendo las 27 unidades federativas y las redes municipal, estatal y federal.',
          },
          {
            label: 'MÉTODO',
            title: 'Pipeline abierto y reproducible',
            description:
              'Recolección, limpieza, modelado y visualización versionados en código — cualquier cifra publicada aquí puede recalcularse.',
          },
        ],
        mission_title: 'OBJETIVO',
        mission_text:
          'Traducir bases educativas extensas y técnicas en indicadores comprensibles sobre infraestructura, aprendizaje, flujo escolar y equidad, apoyando la gestión pública basada en evidencia.',
        alert: 'Bases tratadas: 6 años de microdatos · 5.400 municipios · 25.000 escuelas en la muestra analizada.',
        checklist: [
          'Solo datos públicos y agregados — ningún dato personal del estudiante',
          'Comparaciones siempre por etapa educativa, red y región',
          'Código, diccionario de variables y limitaciones documentados',
        ],
      },
      sources: {
        tag: 'FUENTES Y HERRAMIENTAS',
        title: 'De dónde vienen los datos',
        subtitle:
          'Cada indicador de la plataforma es rastreable hasta su base de origen — y cada etapa del tratamiento está descrita en la metodología.',
        items: {
          censo: {
            title: 'Censo Escolar',
            description:
              'Número de escuelas, matrículas, clases, docentes e infraestructura declarados anualmente por todas las redes de enseñanza.',
          },
          saeb: {
            title: 'SAEB e IDEB',
            description:
              'Competencia en Lengua Portuguesa y Matemática y el índice que combina aprendizaje con flujo escolar.',
          },
          ibge: {
            title: 'IBGE y territorio',
            description:
              'Población, urbanización y recortes regionales usados para normalizar tasas y comparar realidades distintas.',
          },
          stack: {
            title: 'Stack de análisis',
            description:
              'Python y R para el tratamiento, SQL/SQLite para la persistencia y React + TypeScript para publicar los resultados en la web.',
          },
        },
        tech_title: 'TECNOLOGÍAS',
        techs: ['Python', 'pandas', 'R', 'dplyr', 'SQL', 'SQLite', 'React', 'TypeScript'],
      },
      analyses: {
        tag: 'ANÁLISIS',
        title: 'Lo que muestran los datos',
        subtitle:
          'Seis recortes del Censo Demográfico 2022 (IBGE) — cada tarjeta trae el indicador principal y lo que significa en la práctica.',
        items: {
          alfabetizacao: {
            title: 'Alfabetización (15+)',
            description:
              'Cerca del 93% de las personas de 15 años o más saben leer y escribir — la tasa baja entre las mayores y en las poblaciones indígena y negra.',
          },
          escolarizacao_pcd: {
            title: 'Escolarización con discapacidad',
            description:
              'Entre 6 y 14 años, el 92,6% de las personas con discapacidad asiste a la escuela — la inclusión se reduce mucho después de esa edad.',
          },
          deficiencia: {
            title: 'Personas con discapacidad',
            description:
              'El 7,3% de la población de 2 años o más declara al menos una discapacidad; la prevalencia aumenta con la edad.',
          },
          autismo: {
            title: 'Trastorno del espectro autista',
            description:
              'El 1,2% de la población de 2 años o más tiene diagnóstico de autismo, con predominio entre hombres.',
          },
          registro_nascimento: {
            title: 'Registro de nacimiento',
            description:
              'El 99,3% de los niños de hasta 5 años tiene registro; entre indígenas la cobertura baja al 89%.',
          },
          idade_mediana: {
            title: 'Envejecimiento',
            description:
              'La edad mediana de la población es de 35 años y el índice de envejecimiento llega a 55, reflejando el estrechamiento de la base.',
          },
        },
        metric_label: 'INDICADOR SELECCIONADO',
        trends: {
          up: 'indicador destacado',
          down: 'indicador en atención',
          flat: 'indicador estable',
        },
      },
      dashboard: {
        tag: 'PANEL INTERACTIVO',
        title: 'Panorama del Censo 2022',
        subtitle:
          'Indicadores del Censo Demográfico 2022 (IBGE) para el recorte disponible en el export. Elige un indicador para ver el valor de Brasil, comparar las localidades y su reparto interno.',
        select: 'INDICADOR',
        local_title: 'COMPARATIVO POR LOCALIDAD',
        subfilters: 'SUBFILTROS',
        locality: 'LOCALIDAD',
        axis: 'EJE DEL GRÁFICO',
        series_title: 'SERIE POR',
        dimensions: {
          'Idade': 'Edad',
          'Sexo': 'Sexo',
          'Cor ou raça': 'Color o raza',
          'Grupo de idade': 'Grupo de edad',
          'Existência de deficiência': 'Existencia de discapacidad',
          'Nível de instrução': 'Nivel de instrucción',
          'Forma de declaração da idade': 'Forma de declaración de la edad',
          'Grau de dificuldade': 'Grado de dificultad',
          'Alfabetização': 'Alfabetización',
        },
        breakdown_title: 'REPARTO',
        loading: 'Cargando la base del Censo 2022…',
        error: 'No se pudo cargar la base del Censo 2022.',
        source: 'Fuente: {{fonte}}. Recorte del export: Brasil, Goiás y Edealina (GO).',
        units: {
          porcento: '%',
          pessoas: 'personas',
          anos: 'años',
        },
        values: {
          Total: 'Total',
          Homens: 'Hombres',
          Mulheres: 'Mujeres',
          Branca: 'Blanca',
          Preta: 'Negra',
          Amarela: 'Amarilla',
          Parda: 'Parda',
          Indígena: 'Indígena',
          'Pessoa com deficiência': 'Con discapacidad',
          'Pessoa sem deficiência': 'Sin discapacidad',
        },
        indicators: {
          alfabetizacao: {
            title: 'Alfabetización (15+)',
            description: 'Proporción de personas de 15 años o más que saben leer y escribir.',
          },
          populacao: {
            title: 'Población residente',
            description: 'Población residente total censada en 2022.',
          },
          deficiencia: {
            title: 'Personas con discapacidad',
            description: 'Porcentaje de personas de 2 años o más con al menos una discapacidad.',
          },
          escolarizacao_pcd: {
            title: 'Escolarización (6 a 14 años)',
            description: 'Tasa de escolarización de las personas con discapacidad en edad escolar.',
          },
          autismo: {
            title: 'Trastorno del espectro autista',
            description: 'Porcentaje de la población de 2 años o más con diagnóstico de autismo.',
          },
          registro_nascimento: {
            title: 'Registro de nacimiento',
            description: 'Porcentaje de niños de hasta 5 años con registro de nacimiento.',
          },
        },
      },
      footer: {
        title: 'EducaData Brasil',
        description:
          'Landing page del proyecto de análisis de datos abiertos de la educación básica brasileña. Hecha para acercar los indicadores educativos públicos a quienes deciden y a quienes investigan.',
        links_title: 'Navegación',
        sources_title: 'Fuentes oficiales',
        contact_title: 'Contacto',
        contact_text: 'Dudas, correcciones o alianzas con redes de enseñanza:',
        author_credit: 'Desarrollado por Manoel — Científico de Datos',
        about_title: 'Sobre el desarrollador',
        about_text:
          'Científico de Datos apasionado por convertir los datos abiertos de la educación en algo que cualquiera pueda leer. EducaData nació del deseo de acercar a quienes deciden dentro de una red de enseñanza a los números que la describen.',
        sources: [
          { label: 'INEP — Censo Escolar', href: 'https://www.gov.br/inep/pt-br/areas-de-atuacao/pesquisas-estatisticas-e-indicadores/censo-escolar' },
          { label: 'INEP — IDEB', href: 'https://www.gov.br/inep/pt-br/areas-de-atuacao/pesquisas-estatisticas-e-indicadores/ideb' },
        ],
        copyright: '© 2026 DS.Manoel. Todos los derechos reservados.',
        disclaimer: 'Proyecto independiente, sin vínculo institucional con el INEP o el MEC.',
      },
    },
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'pt',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
