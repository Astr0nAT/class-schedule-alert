const WebUntis = require("webuntis");

let username = process.env.untisUsername; // Create a environment variable "untisUsername" with your username
let password = process.env.untisPassword; // After creation restart PC

const untis = new WebUntis(
    "htl1-innsbruck", // Change this value to your own school id
    username,
    password,
    "neilo.webuntis.com" // Change this value to your own webuntis subdomain
);

// These are the class ids from the HTL Innsbruck TODO use untis.getClasses()

let classes = "522 523 524 525 526 527 528 529 530 531 532 533 534 535 536 537 538 539 540 541 542 543 544 545 546 " +
    "547 548 549 550 551 552 553 554 555 556 557 558 559 560 561 562 563 564 565 566 567 568 569 570 571 572 573 " +
    "574 575 576 577 578 579 580 581 582 583 584 585 586 587 588 589 590 650 651 652 653 654 655 656 657 658 659 " +
    "660 662 663 664 665";
// 3AHWII = 526
classes = classes.split(' ');

let currentUntisTime = new Date();
if(currentUntisTime.getMinutes() < 10){
    currentUntisTime = currentUntisTime.getHours().toString() + "0" + currentUntisTime.getMinutes().toString();
}
else{
    currentUntisTime = currentUntisTime.getHours().toString() + currentUntisTime.getMinutes().toString();
}
currentUntisTime = parseInt(currentUntisTime);

let currentLessonStarttime = 0;
// These are the times of the day a new lesson starts TODO use untis.getTimegrid()
let starttimes = [800, 850, 955, 1045, 1140, 1230, 1320, 1410, 1515, 1605, 1655, 1800, 1845, 1945, 2030, 2115];

starttimes.forEach(element => {
    if(element <= currentUntisTime){
        currentLessonStarttime = element;
    }
});

if(currentLessonStarttime == 0){
    currentLessonStarttime = 800;
}
console.log(currentLessonStarttime);

let className = "";
let teacherShort = "";
let teacherName = "";
let roomName = "";
let subjectName = "";
let status;

let teacherList = [];
let contains = false;

const days = 0; // Amount of days in the future; also works with negative numbers and 0
let currentUntisDate = new Date(new Date().getTime() + 24 * 60 * 60 * 1000 * days);

classes.forEach(element => {
    untis.login().then(() => {
        return untis.getClassTimetableFor(element, currentUntisDate);
    }).then(timetable => {
        timetable.forEach(element => {
            if(currentLessonStarttime.toString() === element.startTime.toString()){
                try{
                    className = element.kl.values().next().value.name;
                } catch{
                    className = "-";
                }
                try{
                    teacherShort = element.te.values().next().value.name;
                } catch{
                    teacherShort = "-";
                }
                try{
                    teacherName = element.te.values().next().value.longname;
                } catch{
                    teacherName = "-";
                }
                try{
                    subjectName = element.su.values().next().value.name;
                } catch{
                    subjectName = "-";
                }
                try{
                    roomName = element.ro.values().next().value.name;
                } catch{
                    roomName = "-";
                }
                status = element.code;

                if(status === undefined){
                    status = "normal";
                }

                teacherList.forEach(element => {
                    if(element === teacherShort){
                        contains = true;
                    }
                });

                if(!contains) {
                    console.log("Klasse: " + className + "; Lehrer: " + teacherShort + " " + teacherName + "; Raum: " + roomName + "; Fach: " + subjectName + "; Status: " + status);
                }
                else{
                    contains = false;
                }

                teacherList.push(teacherShort);
            }
        });
    })
    }
);
