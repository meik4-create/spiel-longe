/* Service Worker der Spiele-Lounge: Push-Benachrichtigungen auch bei geschlossener App. */
self.addEventListener("install",function(){self.skipWaiting()});
self.addEventListener("activate",function(e){e.waitUntil(self.clients.claim())});
self.addEventListener("push",function(e){var d={};try{d=e.data.json()}catch(x){}
e.waitUntil(self.clients.matchAll({type:"window",includeUncontrolled:true}).then(function(l){
var vis=l.some(function(c){return c.visibilityState==="visible"});
return self.registration.showNotification(d.title||"Spiele-Lounge",{body:d.body||"",tag:d.tag||"sl",renotify:true,silent:vis,data:{url:d.url||"./"}})}))});
self.addEventListener("notificationclick",function(e){e.notification.close();
e.waitUntil(self.clients.matchAll({type:"window",includeUncontrolled:true}).then(function(l){if(l.length)return l[0].focus();return self.clients.openWindow((e.notification.data&&e.notification.data.url)||"./")}))});
