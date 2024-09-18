const prompt = require("prompt-sync")();

class Product {
  constructor(productId, name, price, category) {
    this.productId = productId;
    this.name = name;
    this.price = price;
    this.category = category;
  }
}

class CartItem {
  constructor(product, quantity) {
    this.product = product;
    this.quantity = quantity;
  }

  totalPrice() {
    return this.product.price * this.quantity;
  }
}

class Cart {
  constructor() {
    this.items = [];
  }

  addToCart(product, quantity = 1) {
    let item = this.items.find(
      (i) => i.product.productId === product.productId
    );
    if (item) {
      item.quantity += quantity;
    } else {
      this.items.push(new CartItem(product, quantity));
    }
  }

  removeFromCart(productId, quantity = 1) {
    let item = this.items.find((i) => i.product.productId === productId);
    if (item) {
      item.quantity -= quantity;
      if (item.quantity <= 0) {
        this.items = this.items.filter(
          (i) => i.product.productId !== productId
        );
      }
    }
  }

  viewCart() {
    let total = 0;
    console.log("Your Cart:");
    this.items.forEach((item) => {
      total += item.totalPrice();
      console.log(
        `${item.product.name} - Quantity: ${
          item.quantity
        }, Price: ${item.product.price.toFixed(2)} USD, Total: ${item
          .totalPrice()
          .toFixed(2)} USD`
      );
    });
    console.log(`Total (before discounts): ${total.toFixed(2)} USD`);
    return total;
  }
}

class DiscountSystem {
  constructor() {
    this.discounts = [
      {
        name: "Buy 1 Get 1 Free on Fashion",
        category: "Fashion",
        type: "bogo",
      },
      {
        name: "10% Off on Electronics",
        category: "Electronics",
        type: "percentage",
        value: 0.1,
      },
    ];
  }

  listDiscounts() {
    console.log("Available Discounts:");
    this.discounts.forEach((discount, index) => {
      console.log(`${index + 1}. ${discount.name}`);
    });
  }

  applyDiscounts(cart) {
    let totalDiscount = 0;
    cart.items.forEach((item) => {
      if (item.product.category === "Fashion" && item.quantity >= 2) {
        let freeItems = Math.floor(item.quantity / 2);
        totalDiscount += freeItems * item.product.price;
      } else if (item.product.category === "Electronics") {
        totalDiscount += item.totalPrice() * 0.1;
      }
    });
    return totalDiscount;
  }
}

class CurrencyConverter {
  constructor() {
    this.rates = { EUR: 0.85, GBP: 0.75 };
  }

  convert(amount, currency) {
    if (this.rates[currency]) {
      return amount * this.rates[currency];
    }
    return amount; // Default to USD if currency not found
  }
}

function populateProducts() {
  return [
    new Product("P001", "Laptop", 1000.0, "Electronics"),
    new Product("P002", "Phone", 500.0, "Electronics"),
    new Product("P003", "T-Shirt", 20.0, "Fashion"),
  ];
}

function findProduct(productId, products) {
  return products.find((product) => product.productId === productId);
}

function main() {
  const products = populateProducts();
  const cart = new Cart();
  const discountSystem = new DiscountSystem();
  const currencyConverter = new CurrencyConverter();

  while (true) {
    let command = prompt(
      "Enter command (add_to_cart, remove_from_cart, view_cart, list_discounts, checkout, quit): "
    ).trim();

    if (command === "add_to_cart") {
      let productId = prompt("Enter Product ID: ").trim();
      let quantity = parseInt(prompt("Enter Quantity: ").trim(), 10);
      let product = findProduct(productId, products);
      if (product) {
        cart.addToCart(product, quantity);
        console.log(`Added ${quantity} ${product.name}(s) to the cart.`);
      } else {
        console.log("Product not found.");
      }
    } else if (command === "remove_from_cart") {
      let productId = prompt("Enter Product ID: ").trim();
      let quantity = parseInt(prompt("Enter Quantity to Remove: ").trim(), 10);
      cart.removeFromCart(productId, quantity);
      console.log(`Removed ${quantity} item(s) from the cart.`);
    } else if (command === "view_cart") {
      cart.viewCart();
    } else if (command === "list_discounts") {
      discountSystem.listDiscounts();
    } else if (command === "checkout") {
      let total = cart.viewCart();
      let discount = discountSystem.applyDiscounts(cart);
      let finalTotal = total - discount;
      console.log(`Total after discounts: ${finalTotal.toFixed(2)} USD`);

      let currencyOption = prompt(
        "Would you like to view it in a different currency? (yes/no): "
      )
        .trim()
        .toLowerCase();
      if (currencyOption === "yes") {
        let currency = prompt(
          "Available Currencies: EUR, GBP\nEnter currency: "
        )
          .trim()
          .toUpperCase();
        let convertedTotal = currencyConverter.convert(finalTotal, currency);
        console.log(`Final Total in ${currency}: ${convertedTotal.toFixed(2)}`);
      }
    } else if (command === "quit") {
      console.log("Exiting the system...");
      break;
    } else {
      console.log("Invalid command. Please try again.");
    }
  }
}

main();
