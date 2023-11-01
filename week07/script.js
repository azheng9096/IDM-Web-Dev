function SellPost(form) {
  var post_input = form.sellinput.value;
  if (!post_input.trim().length) return;

  var post_price = Math.random().toFixed(2);

  // add post
  var sell_results = document.getElementsByClassName("sell-results")[0];
  sell_results.innerHTML += `
    <div class="sell-result">
      <div class="sell-result-post">
        <h4>${post_input}</h4>
        <p>Post by You</p>
      </div>
      <div class="sell-result-price">
        <p>$${post_price}</p>
      </div>
    </div>
  `;

  // update price
  var total_profit_span = document.getElementById("total-profit");
  var total_profit = total_profit_span.textContent.substring(1);
  var new_profit = (parseFloat(total_profit) + parseFloat(post_price)).toFixed(
    2
  );
  total_profit_span.innerHTML = `$${new_profit}`;

  // reset input
  form.sellinput.value = "";
}

function OpenTOC() {
  document.getElementById("toc").style.display = "block";
}

function CloseTOC() {
  document.getElementById("toc").style.display = "none";
}
