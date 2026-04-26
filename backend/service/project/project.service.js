
const repo = require("../../repository/project/project.repository");
const activityRepo = require("../../repository/activity/activity.repository");

// Simple in-memory cache
const cache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds 

exports.createProject = async (data, userId) => {
  const [result] = await repo.createProject({
    ...data,
    created_by: userId,
  });

  if (data.assignments?.length) {
    await repo.assignUsers(result.insertId, data.assignments);
  }

  // Log activity
  await activityRepo.logActivity(userId, 'created project', 'project', result.insertId);

  // Invalidate cache when a new project is created
  cache.delete('projects');

  return result;
};

exports.getProjects = async () => {
  const now = Date.now();
  const cached = cache.get('projects');

  if (cached && (now - cached.timestamp) < CACHE_DURATION) {
    return cached.data;
  }

  const [projects] = await repo.getProjectsWithClientAndAssignedusers();
 
  

  cache.set('projects', { data: projects, timestamp: now });

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

