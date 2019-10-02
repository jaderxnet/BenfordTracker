jQuery("#simulation")
  .on("click", ".s-f58ca0d2-63a7-4c55-a6e6-ac993a128df4 .click", function(event, data) {
    var jEvent, jFirer, cases;
    if(data === undefined) { data = event; }
    jEvent = jimEvent(event);
    jFirer = jEvent.getEventFirer();
    if(jFirer.is("#s-Button_1")) {
      cases = [
        {
          "blocks": [
            {
              "actions": [
                {
                  "action": "jimInsert",
                  "parameter": {
                    "target": [ "#s-Button_1" ],
                    "parent": "#s-f58ca0d2-63a7-4c55-a6e6-ac993a128df4"
                  },
                  "exectype": "serial",
                  "delay": 0
                },
                {
                  "action": "jimShow",
                  "parameter": {
                    "target": [ "#s-Image_1" ],
                    "effect": {
                      "type": "clip",
                      "easing": "linear",
                      "duration": 500
                    }
                  },
                  "exectype": "serial",
                  "delay": 0
                }
              ]
            }
          ],
          "exectype": "serial",
          "delay": 0
        }
      ];
      event.data = data;
      jEvent.launchCases(cases);
    } else if(jFirer.is("#s-Radio_button_1")) {
      cases = [
        {
          "blocks": [
            {
              "condition": {
                "action": "jimXOr",
                "parameter": [ {
                  "datatype": "property",
                  "target": "#s-Radio_button_1",
                  "property": "jimGetValue"
                },{
                  "action": "jimNot",
                  "parameter": [ {
                    "datatype": "property",
                    "target": "#s-Radio_button_1",
                    "property": "jimGetValue"
                  } ]
                } ]
              },
              "actions": [
                {
                  "action": "jimPlayAudio",
                  "parameter": {
                    "target": [ "e8166bd8-956f-482e-917e-fdfa30602c91.wav" ]
                  },
                  "exectype": "serial",
                  "delay": 0
                }
              ]
            }
          ],
          "exectype": "serial",
          "delay": 0
        }
      ];
      event.data = data;
      jEvent.launchCases(cases);
    } else if(jFirer.is("#s-Category_1")) {
      cases = [
        {
          "blocks": [
            {
              "condition": {
                "datatype": "property",
                "target": "#s-Category_1",
                "property": "jimIsVisible"
              },
              "actions": [
                {
                  "action": "jimScrollTo",
                  "parameter": {
                    "target": [ "#s-Category_1" ],
                    "axis": "scrolly",
                    "effect": {
                      "type": "none",
                      "easing": "linear",
                      "duration": 500
                    }
                  },
                  "exectype": "serial",
                  "delay": 0
                }
              ]
            }
          ],
          "exectype": "serial",
          "delay": 0
        }
      ];
      event.data = data;
      jEvent.launchCases(cases);
    } else if(jFirer.is("#s-Input_1")) {
      cases = [
        {
          "blocks": [
            {
              "actions": [
                {
                  "action": "jimShow",
                  "parameter": {
                    "target": [ "#s-Image_3" ],
                    "effect": {
                      "type": "slide",
                      "easing": "easeInCirc",
                      "duration": 3500,
                      "direction": "down"
                    }
                  },
                  "exectype": "serial",
                  "delay": 0
                }
              ]
            }
          ],
          "exectype": "serial",
          "delay": 0
        }
      ];
      event.data = data;
      jEvent.launchCases(cases);
    }
  });