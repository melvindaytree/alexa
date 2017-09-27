// --------------- Helpers that build all of the responses -----------------------
function buildSpeechletResponse(title, output, repromptText, shouldEndSession) {
    return {
        outputSpeech: {
            type: 'PlainText',
            text: output,
        },
        card: {
            type: 'Simple',
            title: `SessionSpeechlet - ${title}`,
            content: `SessionSpeechlet - ${output}`,
        },
        reprompt: {
            outputSpeech: {
                type: 'PlainText',
                text: repromptText,
            },
        },
        shouldEndSession,
    };
}
function buildResponse(sessionAttributes, speechletResponse) {
    return {
        version: '1.0',
        sessionAttributes,
        response: speechletResponse,
    };
}
// ---------------

// --------------- Data ---------------------------------

var choice = [
    {
    "name": "rock",
    "fact": "rock",
    },
    {
    "name": "paper",
    "fact": "paper",
    },
    {
    "name": "scissor",
    "fact": "scissor",
    }
];



// --------------- Events -----------------------
/**
 * Called when the session starts.
 */
function onSessionStarted(sessionStartedRequest, session) {
    console.log(`onSessionStarted requestId=${sessionStartedRequest.requestId}, sessionId=${session.sessionId}`);
}
/**
 * Called when the user launches the skill without specifying what they want.
 */
function onLaunch(launchRequest, session, callback) {
    console.log(`onLaunch requestId=${launchRequest.requestId}, sessionId=${session.sessionId}`);
// Dispatch to your skill's launch.
    getWelcomeResponse(callback);
}

function getWelcomeResponse(callback) {
    /* If we wanted to initialize the session to have some attributes we could add those here.*/
    const sessionAttributes = {};
    const cardTitle = 'Welcome';
    const speechOutput = 'Welcome to RPS, you can play: Rock Paper or Scissor' ;
    /* If the user either does not reply to the welcome message or says something that is not understood, they will be prompted again with this text.*/
    const repromptText = 'You can say: Rock Paper or Scissor ' ;
    const shouldEndSession = false;
callback(sessionAttributes,
        buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
}

/**
 * Called when the user specifies an intent for this skill.
 */
function onIntent(intentRequest, session, callback) {
    console.log(`onIntent requestId=${intentRequest.requestId}, sessionId=${session.sessionId}`);
const intent = intentRequest.intent;
    const intentName = intentRequest.intent.name;
// Dispatch to your skill's intent handlers
    if (intentName === 'AMAZON.HelpIntent') {
        getWelcomeResponse(callback);
    } else if (intentName === 'AMAZON.StopIntent') {
        handleSessionEndRequest(callback);
    }  else if (intentName === 'Rock') {
        alexaPlay(callback, "rock");
    } else if (intentName === 'Paper') {
        alexaPlay(callback, "paper");
    } else if (intentName === 'Scissor') {
        alexaPlay(callback, "scissor");
    }
}

function handleSessionEndRequest(callback) {
    const cardTitle = 'Session Ended';
    const speechOutput = 'Thank you for playing RPS, have a great day!';
    // Setting this to true ends the session and exits the skill.
    const shouldEndSession = true;
callback({}, buildSpeechletResponse(cardTitle, speechOutput, null, shouldEndSession));
}

function alexaPlay(callback, item) {
    

        // If we wanted to initialize the session to have some attributes we could add those here.
    const sessionAttributes = {};
    
    //get random index from array of data
    var index = getRandomInt(Object.keys(choice).length -1);

    //get alexas play
    var alexaChosen = choice[index].name;

    var compare = function(choice1,choice2){
        choice1 = choice1.toLowerCase();
        choice2 = choice2.toLowerCase();
        console.log(choice1);
        console.log(choice2);

    if(choice1 === choice2){
        speechOutput = "The result is a tie!";
    }
    else if(choice1==="rock"){
        if(choice2==="scissor"){
            speechOutput = "Congrats rock wins";
        }
        else{
            speechOutput = "Haha you suck paper wins";
        }
    }
    else if(choice1==="paper"){
        if(choice2==="rock"){
            speechOutput = "Congrats paper wins";
        }
        else{
            speechOutput = "Haha too bad loser Scissor wins";
        }
    }
    else if(choice1==="scissor"){
        if(choice2==="rock"){
            speechOutput = "LOL rock wins";
        }
        else{
            speechOutput = "Congrats scissor wins";
        }
    }
};
compare(item,alexaChosen);


    const cardTitle = "RPS";

     const repromptText = '' ;
    const shouldEndSession = false;
callback(sessionAttributes,
        buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
}

function getRandomInt(max) {
    return Math.floor(Math.random() * (max - 0 + 1)) + 0;
}


/**
 * Called when the user ends the session.
 * Is not called when the skill returns shouldEndSession=true.
 */
function onSessionEnded(sessionEndedRequest, session) {
    console.log(`onSessionEnded requestId=${sessionEndedRequest.requestId}, sessionId=${session.sessionId}`);
    // Add cleanup logic here
}
// --------------- Main handler -----------------------
// Route the incoming request based on type (LaunchRequest, IntentRequest,
// etc.) The JSON body of the request is provided in the event parameter.
exports.handler = (event, context, callback) => {
    try {
        console.log(`event.session.application.applicationId=${event.session.application.applicationId}`);
/**
         * Uncomment this if statement and populate with your skill's application ID to
         * prevent someone else from configuring a skill that sends requests to this function.
         */
        /*
        if (event.session.application.applicationId !== 'amzn1.echo-sdk-ams.app.[unique-value-here]') {
             callback('Invalid Application ID');
        }
        */
if (event.session.new) {
            onSessionStarted({ requestId: event.request.requestId }, event.session);
        }
if (event.request.type === 'LaunchRequest') {
            onLaunch(event.request,
                event.session,
                (sessionAttributes, speechletResponse) => {
                    callback(null, buildResponse(sessionAttributes, speechletResponse));
                });
        } else if (event.request.type === 'IntentRequest') {
            onIntent(event.request,
                event.session,
                (sessionAttributes, speechletResponse) => {
                    callback(null, buildResponse(sessionAttributes, speechletResponse));
                });
        } else if (event.request.type === 'SessionEndedRequest') {
            onSessionEnded(event.request, event.session);
            callback();
        }
    } catch (err) {
        callback(err);
    }
};
