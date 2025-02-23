<script>
const ReturnOrderExtension = {
  name: 'ReturnOrderExtension',
  type: 'response',
  match: ({ trace }) =>
    trace.type === 'ext_order_return' || trace.payload?.name === 'ext_order_return',
  render: ({ trace, element }) => {
    let payloadObj;
    if (typeof trace.payload === 'string') {
      try {
        payloadObj = JSON.parse(trace.payload);
      } catch (e) {
        console.error("Error parsing trace.payload:", e);
        return;
      }
    } else {
      payloadObj = trace.payload || {};
    }

    console.log('Parsed Payload:', payloadObj);

    const formContainer = document.createElement('form');
    formContainer.innerHTML = `
      <style>
        label { font-size: 0.9em; color: #555; display: block; margin-bottom: 5px; }
        select, input[type="number"] {
          width: 100%;
          padding: 8px;
          margin-bottom: 10px;
          border: 1px solid #ccc;
          border-radius: 5px;
        }
        .submit {
          background: linear-gradient(to right, #2e6ee1, #2e7ff1);
          border: none;
          color: white;
          padding: 10px;
          border-radius: 5px;
          width: 100%;
          cursor: pointer;
        }
      </style>

      <label for="quantity">Quantity</label>
      <input type="number" id="quantity" name="quantity" min="1" max="${payloadObj.orderedQuantity || 10}" value="1">

      <label for="reason">Return Reason</label>
      <select id="reason" name="reason">
        <option value="">Select a reason</option>
        <option value="Color">Color</option>
        <option value="Defective">Defective</option>
        <option value="Not as Described">Not as Described</option>
        <option value="Other">Other</option>
        <option value="Size Too Large">Size Too Large</option>
        <option value="Size Too Small">Size Too Small</option>
        <option value="Style">Style</option>
        <option value="Unwanted">Unwanted</option>
        <option value="Wrong Item">Wrong Item</option>
      </select>

      <input type="submit" class="submit" value="${payloadObj.bt_submit || 'Submit'}">
    `;

    formContainer.addEventListener('submit', function (event) {
      event.preventDefault();

      const quantity = formContainer.querySelector('#quantity').value;
      const reason = formContainer.querySelector('#reason').value;

      if (!reason) {
        alert("Please select a return reason.");
        return;
      }

      formContainer.querySelector('.submit').remove();

      window.voiceflow.chat.interact({
        type: 'complete',
        payload: { quantity, reason },
      });
    });

    element.appendChild(formContainer);
  },
};
</script>