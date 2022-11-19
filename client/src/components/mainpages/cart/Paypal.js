import React from 'react'
import { PayPalScriptProvider, PayPalButtons} from "@paypal/react-paypal-js";


function Paypal({ tranSuccess, cart }) {
    return (
        <PayPalScriptProvider

            options={{
                "client-id":
                    "AT6KaXYcczxWblcEhis_J7eXW3bu9gErHKtVXwnSEOeEqetZBzuKRfHHNhnDIFNETHSmL4CaPj7aAdGT" 
            }}
        >

            <PayPalButtons
                style={{ layout : "horizontal",
                color : "gold",
                tagline : false }} 
                createOrder={(data, actions) => {
                    return actions.order
                        .create({
                            purchase_units: [
                                {
                                    amount: {
                                        // currency_code: currency,
                                        value: cart.reduce((result, item) => {
                                            return  item.isPublished && item.countInStock > 0 ? result + (item.price * item.quantity) : result
                                        }, 0).toFixed(2)
                                    },
                                },
                            ],

                        })
                        .then((orderId) => {
                            // Your code here after create the order
                            return orderId;
                        });
                }}
                onApprove={(data, actions) => {
                    console.log('data: ', data);
                    return actions.order.capture().then(function (details) {
                        // This function shows a transaction success message to your buyer.
                        tranSuccess(details)
                    });
                }}
            />

        </PayPalScriptProvider>
    )
}

export default Paypal
