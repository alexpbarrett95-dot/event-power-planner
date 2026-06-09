"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import type { User } from "@supabase/supabase-js";

type Project = {
  id: string;
  user_id: string;
  name: string;
  created_at: string;
};

type ProjectData = {
  systemName: string;
  notes: string;
};

const emptyProjectData: ProjectData = {
  systemName: "",
  notes: "",
};

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [projects, setProjects] = useState<Project[]>([]);
  const [newProjectName, setNewProjectName] = useState("");

  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [projectData, setProjectData] =
    useState<ProjectData>(emptyProjectData);

  async function signUp() {
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) alert(error.message);
    else alert("Account created. Please check your email.");
  }

  async function signIn() {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) alert(error.message);
  }

  async function signOut() {
    await supabase.auth.signOut();
    setUser(null);
    setProjects([]);
    setActiveProject(null);
  }

  async function loadProjects(currentUser: User) {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("user_id", currentUser.id)
      .order("created_at", { ascending: false });

    if (error) {
      alert(error.message);
      return;
    }

    setProjects(data ?? []);
  }

  async function createProject() {
    if (!user) return;

    if (!newProjectName.trim()) {
      alert("Please enter a project name.");
      return;
    }

    const { data: project, error: projectError } = await supabase
      .from("projects")
      .insert([
        {
          name: newProjectName.trim(),
          user_id: user.id,
        },
      ])
      .select()
      .single();

    if (projectError) {
      alert(projectError.message);
      return;
    }

    const { error: dataError } = await supabase.from("project_data").insert([
      {
        project_id: project.id,
        data: emptyProjectData,
      },
    ]);

    if (dataError) {
      alert(dataError.message);
      return;
    }

    setNewProjectName("");
    await loadProjects(user);
  }

  async function deleteProject(projectId: string) {
    if (!confirm("Delete this project?")) return;

    await supabase.from("project_data").delete().eq("project_id", projectId);

    const { error } = await supabase
      .from("projects")
      .delete()
      .eq("id", projectId);

    if (error) {
      alert(error.message);
      return;
    }

    if (activeProject?.id === projectId) {
      setActiveProject(null);
      setProjectData(emptyProjectData);
    }

    if (user) await loadProjects(user);
  }

  async function openProject(project: Project) {
    setActiveProject(project);

    const { data, error } = await supabase
  .from("project_data")
  .select("*")
  .eq("project_id", project.id)
  .maybeSingle();

if (error) {
  alert(error.message);
  return;
}

if (!data) {
  const { error: createDataError } = await supabase.from("project_data").insert([
    {
      project_id: project.id,
      data: emptyProjectData,
    },
  ]);

  if (createDataError) {
    alert(createDataError.message);
    return;
  }

  setProjectData(emptyProjectData);
  return;
}

setProjectData((data.data as ProjectData) ?? emptyProjectData);
  }

  async function saveProject() {
    if (!activeProject) return;

    const { error } = await supabase
      .from("project_data")
      .update({
        data: projectData,
        updated_at: new Date().toISOString(),
      })
      .eq("project_id", activeProject.id);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Project saved.");
  }

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      if (data.user) loadProjects(data.user);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
        if (session?.user) loadProjects(session.user);
        else setProjects([]);
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  if (!user) {
    return (
      <main style={styles.page}>
        <section style={styles.card}>
          <h1>Event Power Planner</h1>
          <p style={styles.muted}>Sign in or create an account.</p>

          <label style={styles.label}>
            Email
            <input
              style={styles.input}
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              type="email"
            />
          </label>

          <label style={styles.label}>
            Password
            <input
              style={styles.input}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              type="password"
            />
          </label>

          <div style={styles.row}>
            <button style={styles.button} onClick={signIn}>
              Sign In
            </button>
            <button style={styles.button} onClick={signUp}>
              Create Account
            </button>
          </div>
        </section>
      </main>
    );
  }

  if (activeProject) {
    return (
      <main style={styles.page}>
        <section style={styles.wideCard}>
          <div style={styles.headerRow}>
            <div>
              <h1>{activeProject.name}</h1>
              <p style={styles.muted}>Project workspace</p>
            </div>

            <div style={styles.row}>
              <button
                style={styles.secondaryButton}
                onClick={() => setActiveProject(null)}
              >
                Back to Projects
              </button>
              <button style={styles.button} onClick={saveProject}>
                Save Project
              </button>
            </div>
          </div>

          <hr style={styles.divider} />

          <label style={styles.label}>
            System Name
            <input
              style={styles.input}
              value={projectData.systemName}
              onChange={(event) =>
                setProjectData({
                  ...projectData,
                  systemName: event.target.value,
                })
              }
            />
          </label>

          <label style={styles.label}>
            Notes
            <textarea
              style={styles.textarea}
              value={projectData.notes}
              onChange={(event) =>
                setProjectData({
                  ...projectData,
                  notes: event.target.value,
                })
              }
            />
          </label>
        </section>
      </main>
    );
  }

  return (
    <main style={styles.page}>
      <section style={styles.wideCard}>
        <div style={styles.headerRow}>
          <div>
            <h1>Event Power Planner</h1>
            <p style={styles.muted}>Signed in as {user.email}</p>
          </div>

          <button style={styles.button} onClick={signOut}>
            Sign Out
          </button>
        </div>

        <hr style={styles.divider} />

        <h2>Projects</h2>

        <div style={styles.createProjectRow}>
          <input
            style={styles.input}
            placeholder="New project name"
            value={newProjectName}
            onChange={(event) => setNewProjectName(event.target.value)}
          />
          <button style={styles.button} onClick={createProject}>
            Create Project
          </button>
        </div>

        <div style={styles.projectList}>
          {projects.length === 0 ? (
            <p style={styles.muted}>No projects yet.</p>
          ) : (
            projects.map((project) => (
              <div key={project.id} style={styles.projectCard}>
                <div>
                  <strong>{project.name}</strong>
                  <p style={styles.muted}>
                    Created {new Date(project.created_at).toLocaleString()}
                  </p>
                </div>

                <div style={styles.row}>
                  <button
                    style={styles.secondaryButton}
                    onClick={() => openProject(project)}
                  >
                    Open
                  </button>
                  <button
                    style={styles.dangerButton}
                    onClick={() => deleteProject(project.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    padding: "40px",
    fontFamily: "Arial, sans-serif",
    background: "#f5f7fb",
  },
  card: {
    maxWidth: "420px",
    margin: "0 auto",
    background: "white",
    padding: "24px",
    borderRadius: "14px",
    border: "1px solid #d9e0ea",
  },
  wideCard: {
    maxWidth: "900px",
    margin: "0 auto",
    background: "white",
    padding: "24px",
    borderRadius: "14px",
    border: "1px solid #d9e0ea",
  },
  muted: { color: "#637083" },
  label: {
    display: "block",
    marginTop: "12px",
    marginBottom: "12px",
  },
  input: {
    width: "100%",
    padding: "10px",
    marginTop: "6px",
    borderRadius: "10px",
    border: "1px solid #d9e0ea",
  },
  textarea: {
    width: "100%",
    minHeight: "120px",
    padding: "10px",
    marginTop: "6px",
    borderRadius: "10px",
    border: "1px solid #d9e0ea",
  },
  row: {
    display: "flex",
    gap: "8px",
    alignItems: "center",
    flexWrap: "wrap",
  },
  headerRow: {
    display: "flex",
    justifyContent: "space-between",
    gap: "16px",
    alignItems: "center",
  },
  createProjectRow: {
    display: "grid",
    gridTemplateColumns: "1fr auto",
    gap: "8px",
    marginBottom: "20px",
  },
  button: {
    padding: "10px 14px",
    borderRadius: "10px",
    border: "1px solid #172033",
    background: "#172033",
    color: "white",
    cursor: "pointer",
  },
  secondaryButton: {
    padding: "10px 14px",
    borderRadius: "10px",
    border: "1px solid #d9e0ea",
    background: "white",
    color: "#172033",
    cursor: "pointer",
  },
  dangerButton: {
    padding: "10px 14px",
    borderRadius: "10px",
    border: "1px solid #c53030",
    background: "#fff5f5",
    color: "#c53030",
    cursor: "pointer",
  },
  divider: {
    border: 0,
    borderTop: "1px solid #d9e0ea",
    margin: "20px 0",
  },
  projectList: {
    display: "grid",
    gap: "10px",
  },
  projectCard: {
    border: "1px solid #d9e0ea",
    borderRadius: "12px",
    padding: "14px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "12px",
  },
};