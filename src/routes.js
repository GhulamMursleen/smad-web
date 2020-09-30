/*!

=========================================================
* Paper Dashboard React - v1.1.0
=========================================================

* Product Page: https://www.creative-tim.com/product/paper-dashboard-react
* Copyright 2019 Creative Tim (https://www.creative-tim.com)

* Licensed under MIT (https://github.com/creativetimofficial/paper-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import Dashboard from "views/Dashboard.jsx";
import terms from "views/terms.jsx";
import privacy from "views/privacy.jsx";
import Office from "views/Office.jsx";
import ViewAllAccessRights from "views/ViewAllAccessRights.jsx";


var routes = [
  {
    path: "/users",
    name: "Users",
    icon: "nc-icon nc-single-02",
    component: Office,
    layout: "/admin"
  },
  
  {
    path: "/viewaccessrights",
    name: "Api Rights",
    icon: "nc-icon nc-pin-3 nc-stre-right",
    component: ViewAllAccessRights,
    layout: "/admin"
  },
  {
    path: "/termsandconditions",
    name: "Terms and Conditions",
    icon: "nc-icon nc-bell-55",
    component: terms,
    layout: "/admin"
  },
  {
    path: "/privacypolicy",
    name: "Privacy Policy",
    icon: "nc-icon nc-bell-55",
    component: privacy,
    layout: "/admin"
  },
];
export default routes;
