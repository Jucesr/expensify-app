class Income {
   constructor(category, description, amount, payment_method, createdAt, note) {
      this.category = category;
      this.description = description;
      this.amount = amount;
      this.payment_method = payment_method;
      this.createdAt = createdAt;
      this.note = note;
   }
}

export default Income;