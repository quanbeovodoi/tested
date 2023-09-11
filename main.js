const pools = [
    [{ symbol: 'VND', amount: 1000000 }, { symbol: 'AUD', amount: 2000000 }],
    [{ symbol: 'AUD', amount: 2000000 }, { symbol: 'AUF', amount: 3000000 }],
    [{ symbol: 'AUF', amount: 1000000 }, { symbol: 'AUG', amount: 4000000 }],
    [{ symbol: 'AUG', amount: 4000000 }, { symbol: 'AUH', amount: 2000000 }],
    [{ symbol: 'AUH', amount: 2000000 }, { symbol: 'VND', amount: 5000000 }],
    [{ symbol: 'VND', amount: 5000000 }, { symbol: 'AUJ', amount: 2000000 }],
    [{ symbol: 'AUJ', amount: 5000000 }, { symbol: 'USD', amount: 20000000 }],
    [{ symbol: 'AUH', amount: 1000000 }, { symbol: 'AUJ', amount: 6000000 }],
    [{ symbol: 'AUJ', amount: 3000000 }, { symbol: 'AUK', amount: 2000000 }],
    [{ symbol: 'AUK', amount: 1000000 }, { symbol: 'USD', amount: 20000000 }]
]
const symbols = {}
pools.map((value) => {
    if (!symbols[value[0].symbol])
        symbols[value[0].symbol] = value[0].amount
    if (!symbols[value[1].symbol])
        symbols[value[1].symbol] = value[1].amount
})
const optVal = Object.keys(symbols).map((val) => `<option value="${val}">${val}</option>`).join('');
document.getElementById("in").innerHTML = optVal;
document.getElementById("out").innerHTML = optVal;
document.getElementById("table").innerHTML = `
    <table>
        <tr>
            <th>symbol</th>
            <th>amount</th>
            <th>symbol</th>
            <th>amount</th>
        </tr>
        ${pools.map((value, index) => `
        <tr ${index % 2 !== 0 ? `class='gray'` : ''}>
            <td>${value[0].symbol}</td>
            <td>${value[0].amount}</td>
            <td>${value[1].symbol}</td>
            <td>${value[1].amount}</td>
        </tr>`).join('')}
    </table>
    `
function exchange(symbol, amount, targetSymbol) {
    const results = [];
    const visited = {};
    function findedMoney(currSymbol, currAmount, path) {
        if (currSymbol === targetSymbol) {
            results.push({ path, rate: currAmount / amount });
            return;
        }
        for (const pool of pools) {
            const [from, to] = pool;
            const rate = to.amount / from.amount;
            if (visited[to.symbol] === symbol) {
                return;
            }
            if (from.symbol === currSymbol && rate > 0) {
                const remainingAmount = currAmount * rate;
                visited[`${from.symbol}`] = to.symbol;
                findedMoney(to.symbol, remainingAmount, path.concat([`${currSymbol} -> ${to.symbol}`]));
            }
        }
    }
    findedMoney(symbol, amount, [])
    return results;
}
function actionExchange() {
    const symbol = document.getElementById('in').value;
    const targetSymbol = document.getElementById('out').value;
    const amountN = Number(document.getElementById('valueInput').value);
    const results = exchange(symbol ? symbol : 'VND', amountN ? amountN : 1, targetSymbol ? targetSymbol : 'USD');
    document.getElementById('result').value = results.map((result) => `{\n route:${result.path},\n rate:${result.rate}\n}\n`).join('');
}