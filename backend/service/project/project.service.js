
const repo = require("../../repository/project/project.repository");
const activityRepo = require("../../repository/activity/activity.repository");


const cache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; 

exports.createProject = async (data, userId) => {
  const [result] = await repo.createProject({
    ...data,
    created_by: userId,
  });

  if (data.assignments?.length) {
    await repo.assignUsers(result.insertId, data.assignments);
  }


  await activityRepo.logActivity(userId, 'created project', 'project', result.insertId);


  cache.delete('projects');

  return result;
};

exports.getProjects = async (user) => {
  const parseAssignedUsers = (projects) => {
    projects.forEach((project) => {
      if (project.assigned_users && typeof project.assigned_users === "string") {
        try {
          project.assigned_users = JSON.parse(project.assigned_users);
        } catch (error) {
          project.assigned_users = [];
        }
      }
    });
  };

  if (user?.role_name === "Client" && user.client_id) {
    const [projects] = await repo.getProjectsByClientId(user.client_id);
    parseAssignedUsers(projects);
    return projects;
  }

  const now = Date.now();
  const cached = cache.get("projects");

  if (cached && now - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }

  const [projects] = await repo.getProjectsWithClientAndAssignedusers();
  parseAssignedUsers(projects);
  cache.set("projects", { data: projects, timestamp: now });

  return projects;
};

exports.getClientProjects = async (user_id) => {
  const [projects] = await repo.getClientProjects(user_id);
  return projects;
};

exports.getAssignedUserProjects = async (user_id) => {
  const [projects] = await repo.getAssignedUserProject(user_id);
  return projects;
};

const VALID_TRANSITIONS = {
    planned: ["active"],
    active: ["completed", "on_hold"],
    on_hold: ["active"],
    completed: [],
  };
  
  exports.updateProjectStatus = async (projectId, newStatus, userId) => {
    const [rows] = await repo.getProjectById(projectId);
    const project = rows[0];
  
    if (!VALID_TRANSITIONS[project.status].includes(newStatus)) {
      throw new Error("Invalid status transition");
    }
  
    await repo.updateStatus(projectId, newStatus);
  
    await repo.insertStatusLog({
      project_id: projectId,
      old_status: project.status,
      new_status: newStatus,
      changed_by: userId,
    });

    // Log activity
    await activityRepo.logActivity(userId, `updated project status to ${newStatus}`, 'project', projectId);
  };

