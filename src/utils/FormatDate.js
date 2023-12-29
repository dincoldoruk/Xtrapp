export function formatDate(date) {
    const day = date.getDate();
    const month = date.getMonth() + 1; // Ay endeksi 0'dan başlar, bu nedenle +1 ekliyoruz
    const year = date.getFullYear();
  
    // Gün ve ay 10'dan küçükse önlerine 0 ekleyerek iki haneli yapma
    const formattedDay = day < 10 ? '0' + day : day;
    const formattedMonth = month < 10 ? '0' + month : month;
  
    // Formatı dd/mm/yyyy şeklinde birleştirme
    return formattedDay + '/' + formattedMonth + '/' + year;
  }

