class Order {
    constructor(id, userId, deliveryId, products, totalAmount, date){
        this.id = id;
        this.userId = userId;
        this.deliveryId = deliveryId;
        this.products = products;
        this.totalAmount = totalAmount;
        this.date = date;
    }
}

export default Order;