<script>

    const values = {
    path: '/store-2',
};
  
</script>


<script>
  (function(path){
    let collectionId;

    fetch(document.location.origin + path +'?format=json-pretty')

        .then(response => response.json())
        .then(data => {
            collectionId = data.collection.id;
            
                createComponent();
        });


    function createComponent() {
        const collectionItem = document.querySelector(`.collection-${collectionId}.view-item`);
        if(collectionItem) {
          collectionItem.classList.add('subscribtion-item');
          const product = collectionItem.querySelector('.ProductItem');
          const priceBlock = product.querySelector('.ProductItem-product-price');
          const subscrOption = product.querySelector('.subscription-option');

        if(subscrOption) {
            const clonedPriceBlock = priceBlock.cloneNode(true);
            clonedPriceBlock.classList.add('changing-price', 'invisible');
            const productContainer = product.querySelector('.ProductItem-details-checkout');

            productContainer.insertBefore(clonedPriceBlock, priceBlock);

            const container = product.querySelector('.pdp-subscriptions-and-otp');
            const priceObj = JSON.parse(container.getAttribute('data-variants'))[0].pricingOptions;

            const buttonList = createRadioButtons(priceObj);

            injectHTML(`
			<div class="radio-buttons-ontainer">
  					${buttonList.join('')}
  				</div>
		`);


            function createRadioButtons(obj) {
                const buttonList = [];

                obj.forEach((el, i) => {

                    const id = el.productSubscriptionOptionId;

                    const period = el.subscriptionPlan.billingPeriod.unit;
                    const percent = el.percentageDiscount;

                    const createButtonEl = `<div class="inputs-radio-wrap">
  <input type="radio" id=${id} value=${percent} name="otp-subs-radio" class="subscription-value-group" data-id=${i} data-percentage=${percent * 100}% subscription-price=${el.priceMoney.value}>
  <label for=${id}>Deliver ${period}, save ${percent * 100}%</label>
</div>
`;
                    buttonList.push(createButtonEl);
                })

                return buttonList;
            }


            function injectHTML(html) {
                const container = product.querySelector('.subscription-option');
                const div = document.createElement('div');
                div.innerHTML = html;
                container.appendChild(div);

                addInputListeners();
            }

            function addInputListeners() {
                const inputs = product.querySelectorAll('.subscription-value-group');

                inputs.forEach((input, i) => {
                    input.addEventListener('change', () => {

                        const index = i;

                        const select = product.querySelector('.subscription-frequency');
                        select.selectedIndex = index;
                        const id = input.getAttribute('id');
                        product.querySelector('.subscription-option').setAttribute('data-selected-id', id);

                    })
                })
            }

            const inputs = product.querySelectorAll('input');
            const quantityBlock = product.querySelector('.product-quantity-input');
            const cartInner = product.querySelector('.sqs-add-to-cart-button-inner');
            const cartBtn = product.querySelector('.sqs-add-to-cart-button');
            const clonedPrice = product.querySelector('.changing-price');
            const priceInner = clonedPrice.querySelector('.product-price');
            const fullPrice = product.querySelector('.ProductItem-product-price:not(.changing-price)');

            inputs.forEach((input, i) => {
                input.addEventListener('change', () => {
                    const message = product.querySelector('.message-block');

                    if (message) {
                        message.style.display = 'none';
                    } else {
                        createMessageBlock();
                    }

                    if (input.checked && input.classList.contains('subscription-value-group')) {
                        quantityBlock.classList.add('invisible');
                        cartBtn.setAttribute('data-is-subscription', true);
                        cartInner.innerHTML = 'Subscribe';
                        cartBtn.setAttribute('data-subscription-option-id', input.getAttribute('id'));

                        const salesPrice = input.getAttribute('subscription-price');
                        clonedPrice.querySelector('.product-price').innerHTML = salesPrice;

                        fullPrice.classList.add('text-decoration');
                        clonedPrice.classList.remove('invisible');

                        massageVisible(true, input.value);

                    } else {
                        quantityBlock.classList.remove('invisible');
                        clonedPrice.classList.add('invisible');
                        fullPrice.classList.remove('text-decoration');
                        massageVisible(false, input.value);
                    }
                })

            })


            function createMessageBlock() {
                const message = document.createElement('span');
                message.classList.add('message-block');

                fullPrice.appendChild(message);
                message.style.display = 'none';
            }

            function massageVisible(condition, value) {
                const message = document.querySelector('.message-block');

                if (condition) {
                    message.innerHTML = `<p class="message-text">Subscribtion save ${value * 100}%</p>`;
                    message.style.display = 'inline-block';
                } else {
                    message.style.display = 'none';
                }
            }

        }
    }
   }
    
})(values.path)
  
</script>
