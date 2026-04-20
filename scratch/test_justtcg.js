import { JustTCG } from 'justtcg-js';

const client = new JustTCG({ apiKey: 'tcg_edcfd2be51a448d1a00ebe9a161dd50b' });

async function test() {
    try {
        const response = await client.v1.cards.get({
            game: 'one-piece-card-game',
            limit: 1
        });
        if (response.data && response.data.length > 0) {
            console.log("Card Data Sample:", JSON.stringify(response.data[0], null, 2));
        } else {
            console.log("No data found");
        }
    } catch (err) {
        console.error(err);
    }
}

test();
