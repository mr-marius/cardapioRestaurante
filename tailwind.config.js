/** @type {import('tailwindcss').Config} */
module.exports = {
  /**Arquivos a serem utilizados pelo tailwind*/
  content: ['./**/*.{html,js}'],
  theme: {
    /**Utilização de font roboto*/
    fontFamily:{
      'sans': ['Poppins', 'sans-serif']
    },
    extend: {
      backgroundImage:{
        "home": "url('/assets/images/bg.png')"
      }
    },
  },
  plugins: [],
}

