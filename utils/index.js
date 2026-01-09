import moment from "moment";

export default {
  ifequal(a, b, options) {
    return String(a) === String(b)
      ? options.fn(this)
      : options.inverse(this)
  },

  formatDate(date){
    return moment(date).format('DD.MM.YYYY')
  },

  // Hozirgi sana va vaqt
  currentDateTime() {
    return moment().format('DD.MM.YYYY HH:mm:ss'); // sana + soat:minut:sekund
  }
}
