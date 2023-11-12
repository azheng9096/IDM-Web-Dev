// --- MEDIA DYNAMIC SETUP ---
// Reference: https://stackoverflow.com/questions/39020670/rotate-objects-around-circle-using-css
const radius = 250;
const media_items = document.querySelectorAll(".media-item");
const media_items_container = document.querySelector(".media-items-container");
const width = media_items_container.getBoundingClientRect().width;
const height = media_items_container.getBoundingClientRect().height;

let angle = 0,
  step = (2 * Math.PI) / media_items.length;

media_items.forEach((item) => {
  let x = Math.round(
    width / 2 +
      radius * Math.cos(angle) -
      item.getBoundingClientRect().width / 2
  );
  let y = Math.round(
    height / 2 +
      radius * Math.sin(angle) -
      item.getBoundingClientRect().height / 2
  );

  item.style.left = x + "px";
  item.style.top = y + "px";

  angle += step;
});

// --- MEDIA ANIMATION CONTROL ---
media_items.forEach((item) =>
  item.addEventListener("mouseenter", mediaPauseAnimation)
);
media_items.forEach((item) =>
  item.addEventListener("mouseleave", mediaUnpauseAnimation)
);

function mediaPauseAnimation() {
  media_items_container.classList.add("pause-animation");
  media_items.forEach((item) => {
    item.classList.add("pause-animation");
  });
}

function mediaUnpauseAnimation() {
  media_items_container.classList.remove("pause-animation");
  media_items.forEach((item) => {
    item.classList.remove("pause-animation");
  });
}

// --- MEDIA CONTENT CONTROL ---
const media_items_text = {
  "In Person":
    "In person communication, although primitive, has a lot of complexity in itself.\
    When we communicate in person, we are able to observe the facial expressions and \
    gestures. These allow us to interpret and infer a lot more than just the message \
    spoken by the speaker. These body language and facial feature would influence the \
    way we react, and we may also learn from it (in the long term, we may slowly learn \
    or imitate such behavior in similar situations).\r\n\r\n\
    As in person conversation also requires immediate response (long periods of silence \
    would lead to an awkward situation), people learn to react and connect ideas fast \
    to give an appropriate responses. The requirement of back and forth also allow \
    participants to facilitate deeper conversations.",
  Phone:
    "Unlike in person communication, conversation through phone conversation, \
    whether landline or mobile, presents limitations as we (usually) do not see \
    the other person visually. The lack of body language and facial expressions leaves \
    us to heavily rely on diction choices and tones to gain a deeper understanding of the 'true' message \
    the other person is trying to convey. It also means that the control of our own tone \
    becomes prevelant as tones can drastically change the meaning of a message being conveyed.\r\n\r\n\
    Phone conversations also require immediate responses, much like in person conversations, as \
    long periods of seilence would lead to an awkward situation. As such, it trains us on \
    getting better on (and quickly) interpret tones and diction choices during ongoing conversations.",
  "Text Messaging":
    "Text messaging is a very common form of communication today, and it exists in different forms \
    (SMS, social media chat, etc...). While the various forms offers different functionalities, \
    in general, text messaging allows us to receive and send messages instantly. However, at the same time, \
    it also allows us to leave a message unread until we are ready to respond. This leaves the responder with \
    longer time to craft up an appropriate response (and perhaps, in some cases, more anxiety when doing so). \
    This also brings up the question of are you the same person when you are online vs in person?\r\n\r\n\
    Another thing to note is that text messaging is limited in visual (body language, facial expressions) and auditory (tone) hints.\
    This is notable as it conducted the use of emojis and abbreviations like /s to indicate or better convey \
    message intentions.",
  "Social Media/Internet":
    "Social media and the internet is interesting to study as it has a profound impact on people in many ways, especially psychologically \
    and socially. It allows us to connect with people all over the globe and engage in discussions with thousands or even millions of \
    people at the same time. However, it has also enabled people to constantly compare themselves to others (which can sometimes facilitate \
    unrealistic standards) -- the highs and lows from upwards/downward social comparisons has great psychological impacts.\r\n\r\n\
    The low character or media length limits in social media also influence the brains to have shorter attention span. \
    This also allows social media to constantly bombard the user with information, making them pure media consumers -- they \
    seldom stop to think critically about an information they've received. I feel that the combination of the functionalities social media offers \
    and all these influences has enabled the concept of 'cancel culture'.",
  Smartphone:
    "The portability of smartphones and its ability to connect to the internet better facilitates the psychological and social impacts of the internet, \
    especially social media. People are constantly on their phones to be up to date with the latest news and trend. Before the days of smartphones, being \
    up to date could mean a day, several days, or even weeks. However, with notifications and instant communication, this has become several hours or even several \
    minutes. People are in constant fear of missing out on the latest trends and falling behind.\r\n\r\n\
    Notification bell chimes has conditioned people to immediately check their phones to see if anyone had interacted with them. The portability of \
    smartphones has allowed them to do so in any place and any time as people are always carrying it with them. Smartphones also offer leisure (read: distraction) \
    at one's disposal, leading to phone usage dominating social events. Thank about the last time you used your phone at the dinner table.",
};

const discussion_panel = document.querySelector(".discussion-panel");
const discussion_heading = discussion_panel.querySelector("h2");
const discussion_text = discussion_panel.querySelector("p");
function displayMediaDiscussion(media) {
  if (!(media in media_items_text)) {
    console.error("Media not in object");
    return;
  }

  discussion_heading.textContent = media;
  discussion_text.textContent = media_items_text[media];
}

// --- PHONE CONTROL ---
let num_notifs = 0;
let notif_sfx = new Audio("audio/sound-3.mp3");

let notif_icon = document.querySelector(".notification-icon");
notif_icon.addEventListener("click", clickNotif);

setTimeout(incrementNotifAlarm, 10000);
function incrementNotifAlarm() {
  incrementNotif();

  let min = 10000; // 10s
  let max = 20000; // 20s
  let new_time = Math.floor(Math.random() * (max - min + 1) + min);
  setTimeout(incrementNotifAlarm, new_time);
}

function incrementNotif() {
  num_notifs++;
  notif_icon.classList.remove("hide");
  notif_icon.textContent = num_notifs + "";
  notif_sfx.play();
}

function clickNotif() {
  if (num_notifs <= 0) return;
  showMessage();

  num_notifs = 0;
  notif_icon.classList.add("hide");
  notif_icon.textContent = "";
}

let messages = [
  "How much control does your phone have over you?",
  "How often do you check your notifications?",
  "Does the notification ring prompt you to immediately check your device?",
  "How has a medium influenced you?",
  "How much impact can a medium have on your social or psychological state?",
];
let toast = document.querySelector(".toast");
function showMessage() {
  let random_i = Math.floor(Math.random() * messages.length);
  toast.textContent = messages[random_i];
  toast.classList.add("show");
  setTimeout(() => {
    toast.classList.remove("show");
  }, 5000);
}
