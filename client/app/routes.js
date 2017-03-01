// @flow
import React from 'react'
import { Route, IndexRoute } from 'react-router'
import App from './pages/App'

//impot page
import MainPage from "./pages/MainPage"
import LoginPage from './pages/LoginPage'
import TaskPage from './pages/TaskPage'
import AchievementsPage from './pages/AchievementsPage'
import DashboardPage from './pages/DashboardPage'
import PunishmentsPage from './pages/PunishmentsPage'
import TagsPage from './pages/TagsPage'
import NotificationsPage from './pages/NotificationsPage'
import MoodsPage from './pages/MoodsPage'
import OptiquesPage from './pages/OptiquesPage'
import PersonalPage from './pages/PersonalPage'

import ManageCollectPage from './pages/teacher/ManageCollectPage'
import ManageNotificationPage from './pages/teacher/ManageNotificationPage'
import ManageStudentPage from './pages/teacher/ManageStudentPage'
import ManageAchievementPage from './pages/teacher/ManageAchievementPage'
import ManagePunishmentPage from './pages/teacher/ManagePunishmentPage'
import AddNotificationPage from './pages/teacher/AddNotificationPage'
import ManageTeacherPage from './pages/admin/ManageTeacherPage'
import ManageClassPage from './pages/admin/ManageClassPage'
import ManageCoursePage from './pages/admin/ManageCoursePage'
import InfoPage from './pages/InfoPage'
import ManageSchedualPage from './pages/admin/ManageSchedualPage'
import SchedualPage from './pages/SchedualPage'

import StudentMoodsDataPage from './pages/teacher/StudentMoodsDataPage'
import StudentOptiquesDataPage from './pages/teacher/StudentOptiquesDataPage'
import TeacherCoursePage from './pages/teacher/TeacherCoursePage'
import ManageClassroomPage from './pages/teacher/ManageClassroomPage'
import StudentTasksDataPage from './pages/teacher/StudentTasksDataPage'
import CollectDetailPage from './pages/teacher/CollectDetailPage'
import CreateUserPage from './pages/teacher/CreateUserPage'
import ScoresPage from './pages/ScoresPage'
import GiveScorePage from './pages/teacher/GiveScorePage'

import Page404 from './pages/errors/Page404'
import requireRole from './components/auth/requireRole'
import CheckUpPage from './pages/teacher/CheckUpPage'

export default (
  <Route path="/" component={App}>
    <IndexRoute component={NotificationsPage} />
    <Route path='/notifications(/:page)' component={NotificationsPage} />
    <Route path='/info' component={InfoPage} />
    <Route path='/scores/:studentId' component={ScoresPage} />

    {/** student router */}
    <Route path='/tasks' component={requireRole(TaskPage, 'student')} />
    <Route path='/dashboard' component={requireRole(DashboardPage, 'student')} />
    <Route path='/achievements' component={requireRole(AchievementsPage, 'student')} />
    <Route path='/punishments' component={requireRole(PunishmentsPage, 'student')} />
    <Route path='/optiques' component={requireRole(OptiquesPage, 'student')} />
    <Route path='/tags' component={requireRole(TagsPage, 'student')} />
    <Route path='/moods' component={requireRole(MoodsPage, 'student')} />

    {/** teacher router **/}
    <Route path='/manageStudent' component={requireRole(ManageStudentPage, ['teacher', 'admin', 'superAdmin'])} />
    <Route path='/manageNotification' component={requireRole(ManageNotificationPage, ['admin', 'superAdmin'])} />
    <Route path='/manageCollect' component={requireRole(ManageCollectPage, ['teacher', 'admin', 'superAdmin'])} />
    <Route path='/manageClassroom' component={requireRole(ManageClassroomPage, ['teacher', 'admin', 'superAdmin'])} />
    <Route path='/manageAchievement' component={requireRole(ManageAchievementPage, ['teacher', 'admin', 'superAdmin'])} />
    <Route path='/managePunishment(/:page)' component={requireRole(ManagePunishmentPage, ['teacher', 'admin', 'superAdmin'])} />
    <Route path='/manageTeacher' component={requireRole(ManageTeacherPage, ['admin', 'superAdmin'])} />
    <Route path='/manageCourse' component={requireRole(ManageCoursePage, ['admin', 'superAdmin'])} />
    <Route path='/teacherCourse' component={requireRole(TeacherCoursePage, ['teacher', 'admin'])} />
    <Route path='/manageClass' component={requireRole(ManageClassPage, ['admin', 'superAdmin'])} />
    <Route path='/giveScore/:classId/:courseId' component={requireRole(GiveScorePage, ['admin', 'teacher'])} />

    {/** admin router */}
    <Route path='/addNotification' component={requireRole(AddNotificationPage, ['teacher', 'admin', 'superAdmin'])} />
    <Route path='/modifyNotification/:id' component={requireRole(AddNotificationPage, ['admin', 'superAdmin'])} />
    <Route path='/manageScheduals/:classId' component={ManageSchedualPage} />
    
    <Route path='/details' component={PersonalPage} />
    <Route path='/users/create' component={CreateUserPage} />
    <Route path='/users/:id' component={PersonalPage} />
    <Route path='/users/:id/edit' component={CreateUserPage} />
    <Route path='/users/tasks/:id' component={StudentTasksDataPage} />
    <Route path='/users/optiques/:id' component={StudentOptiquesDataPage} />
    <Route path='/users/moods/:id' component={StudentMoodsDataPage} />
    <Route path='/collects/:id' component={CollectDetailPage} />
    <Route path='/schedual(/:userId)' component={SchedualPage} />
    <Route path='/checkUp/:schedualId/:classId' component={requireRole(CheckUpPage, ['admin', 'superAdmin', 'teacher'])} />
    <Route path="*" component={Page404} />
  </Route>
);
