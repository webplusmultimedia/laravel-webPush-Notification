let pushNotification = document.getElementById('push');

function main() {
    const permission = document.getElementById('push-notification')

    if(
        ('Notification' in window) &&
        ('serviceWorker' in navigator) &&
        (Notification.permission === 'granted')
    ){

        pushNotification.addEventListener('click',notifyMe)
    }

    if (
        !permission ||
        !('Notification' in window) ||
        !('serviceWorker' in navigator) ||
        Notification.permission !== 'default'
    ) {

        return;
    }



    const btn = document.createElement('button')
    btn.innerText = 'Recevoir les Notifications'
    btn.classList.add('btn', 'btn-primary', 'my-3', 'text-light')
    permission.appendChild(btn)
    btn.addEventListener('click', askPermission)
}


async function askPermission() {

    const permission = await Notification.requestPermission()

    if (permission === 'granted') {
        registerServiceWorker()
    }
}

async function registerServiceWorker() {
    const registration = await navigator.serviceWorker.register('/js/sw.js')
    const subscription = await registration.pushManager.getSubscription()

    if (subscription)
        pushNotification.addEventListener('click',notifyMe)

    if(!subscription) {
        const souscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: await getPublicKey()
        })

        await subscribe(souscription)

        pushNotification.addEventListener('click',notifyMe)
    }
}

async function getPublicKey() {
    const {key} = await fetch(
        '/push/key',
        {
            headers: {Accept: 'application/json'},
        }
    ).then(r => r.json())
    return key
}

/**
 *
 * @param {PushSubscription} souscription
 * @returns {Promise<void>}
 */
async function subscribe(souscription) {
    const token = document.querySelector('meta[name=csrf-token]').getAttribute('content');

    await fetch
    (
        '/push/subscribe',
        {
            method: 'post',
            headers: {
                'Content-type': 'application/json',
                Accept: 'application/json',
                'X-CSRF-Token': token
            },
            body: JSON.stringify(souscription)
        }
    )
        .catch(e => console.log(e))
}

async function notifyMe(e) {
    e.preventDefault()
      await fetch(
        '/push/notify-all',
        {
            headers: {Accept: 'application/json'},
        }
    ).then(r => console.log(r.json()))

}

main()
