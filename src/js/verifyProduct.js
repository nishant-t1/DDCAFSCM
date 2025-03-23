App = {
    web3Provider: null,
    contracts: {},

    init: async function() {
        return await App.initWeb3();
    },

    initWeb3: function() {
        if (window.web3) {
            App.web3Provider = window.web3.currentProvider;
        } else {
            App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
        }

        web3 = new Web3(App.web3Provider);
        return App.initContract();
    },

    initContract: function() {
        $.getJSON('product.json', function(data) {
            console.log("product.json Loaded:", data);
            var productArtifact = data;
            App.contracts.product = TruffleContract(productArtifact);
            App.contracts.product.setProvider(App.web3Provider);
        }).fail(function(jqXHR, textStatus, errorThrown) {
            console.error("Failed to load product.json:", textStatus, errorThrown);
        });

        return App.bindEvents();
    },

    bindEvents: function() {
        $(document).on('click', '.btn-register', App.getData);
    },

    getData: function(event) {
        event.preventDefault();
        var productSN = document.getElementById('productSN').value;
        var consumerCode = document.getElementById('consumerCode').value;
        var productInstance;

        web3.eth.getAccounts(function(error, accounts) {
            if (error) {
                console.log(error);
            }

            var account = accounts[0];

            App.contracts.product.deployed().then(function(instance) {
                productInstance = instance;
                return productInstance.verifyProduct(web3.fromAscii(productSN), web3.fromAscii(consumerCode), { from: account });
            }).then(function(result) {
                console.log("Verification Result:", result,"Type:", typeof result);
                var t = "";
                var tr = "<tr>";
                
                if (result === true) { // Explicitly checking for boolean true
                    tr += "<td>Yayy, Genuine Product!!.</td>";
                } else if (result === false) { // Explicitly checking for boolean false
                    tr += "<td>Sorry, Counterfeit Product Detected!!.</td>";
                    App.sendEmailAlert(productSN);
                } else {
                    tr += "<td>Unexpected Result. Please check the contract.</td>";
                }
                
                
                tr += "</tr>";
                t += tr;

                document.getElementById('logdata').innerHTML = t;
                document.getElementById('add').innerHTML = account;
            }).catch(function(err) {
                console.log("Error:", err.message);
            });
        });
    },

    sendEmailAlert: function(productSN) {
        console.log("Counterfeit product detected. Sending email alert...");

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
                const location = `${position.coords.latitude},${position.coords.longitude}`;
                console.log("Location Captured:", location);

                fetch("http://localhost:5000/send-alert", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        productId: productSN,
                        location: location,
                        reporter: "User"
                    })
                })
                .then(response => response.json())
                .then(data => {
                    console.log("Email Alert Sent:", data);
                    alert("Counterfeit product detected and reported to the Manufacturer!");
                })
                .catch(error => {
                    console.error("Error sending email:", error);
                });

            }, function() {
                console.error("Location permission denied.");
                alert("Location permission denied. Cannot send email alert.");
            });
        } else {
            console.error("Geolocation not supported.");
            alert("Geolocation is not supported by this browser.");
        }
    }
};

$(function() {
    $(window).load(function() {
        App.init();
    });
});
