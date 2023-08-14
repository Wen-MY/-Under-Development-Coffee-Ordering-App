import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'react-native'; // Import Button from React Native

const CartScreen = ({ cartItems, handleUpdateCartQty, handleRemoveFromCart, navigation }) => {
  return (
    <div className="cart-screen">
      {cartItems.map((item) => (
        <div key={item.id} className="cart-item">
          <img className="cart-item__image" src={item.image.url} alt={item.name} />
          <div className="cart-item__details">
            <h4 className="cart-item__details-name">{item.name}</h4>
            <div className="cart-item__details-qty">
              <button
                type="button"
                onClick={() =>
                  item.quantity > 1
                    ? handleUpdateCartQty(item.id, item.quantity - 1)
                    : handleRemoveFromCart()
                }
              >
                -
              </button>
              <p>{item.quantity}</p>
              <button
                type="button"
                onClick={() => handleUpdateCartQty(item.id, item.quantity + 1)}
              >
                +
              </button>
            </div>
            <div className="cart-item__details-price">
              {item.line_total.formatted_with_symbol}
            </div>
          </div>
          <button
            type="button"
            className="cart-item__remove"
            onClick={handleRemoveFromCart}
          >
            Remove
          </button>
        </div>
      ))}
      <Button
        title="Proceed to Payment"
        onPress={() => navigation.navigate('Payment')} // Use the provided navigation prop
      />
    </div>
  );
};

CartScreen.propTypes = {
  cartItems: PropTypes.arrayOf(PropTypes.object),
  handleUpdateCartQty: PropTypes.func,
  handleRemoveFromCart: PropTypes.func,
  navigation: PropTypes.object, // Add navigation prop
};

export default CartScreen;
