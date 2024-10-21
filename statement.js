function statement(invoice, plays) {
  let totalAmount = 0;
  let volumeCredits = 0;
  let result = `<h3>청구 내역 (고객명: ${invoice.customer})<h3>\n`;
  const format = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format;

  for (let perf of invoice.performances) {
    const play = plays[perf.playID];
    let thisAmount = 0;

    switch (play.type) {
      case "tragedy": // 비극
        thisAmount = 40000;
        if (perf.audience > 30) {
          thisAmount += 1000 * (perf.audience - 30);
        }
        break;
      case "comedy": // 희극
        thisAmount = 30000;
        if (perf.audience > 20) {
          thisAmount += 10000 + 500 * (perf.audience - 20);
        }
        thisAmount += 300 * perf.audience;
        break;
      case "history": // 사극
        thisAmount = 10000;
        thisAmount += 1500 * perf.audience;
        break;
      default:
        throw new Error(`알 수 없는 장르: ${play.type}`);
    }

    // 포인트를 적립한다.
    volumeCredits += Math.max(perf.audience - 30, 0);
    // 희극 관객 5명마다 추가 포인트를 제공한다.
    if ("comedy" === play.type) volumeCredits += Math.floor(perf.audience / 5);
    //사극 20명 이상 10포인트 지급
    if ("history" === play.type) volumeCredits += 10;

    // 청구 내역을 출력한다.
    result += `<h4>${play.name}: ${format(thisAmount / 100)} (${
      perf.audience
    }석)</h4>\n`;
    totalAmount += thisAmount;
  }
  result += `<h3>총액: ${format(totalAmount / 100)}</h3>\n`;
  result += `<h3>적립 포인트: ${volumeCredits}점</h3>\n`;
  return result;
}

module.exports = { statement };
