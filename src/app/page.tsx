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

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [projects, setProjects] = useState<Project[]>([]);
  const [newProjectName, setNewProjectName] = useState("");

  async function signUp() {
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      alert(error.message);
      return;
    }

    alert("Account created. Please check your email to confirm your account.");
  }

  async function signIn() {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert(error.message);
      return;
    }
  }

  async function signOut() {
    await supabase.auth.signOut();
    setUser(null);
    setProjects([]);
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

  const {
    data: { session },
  } = await supabase.auth.getSession();

  console.log("Session user id:", session?.user.id);
  console.log("State user id:", user.id);

  const { error } = await supabase.from("projects").insert([
    {
      name: newProjectName.trim(),
      user_id: user.id,
    },
  ]);

  if (error) {
    alert(error.message);
    return;
  }

  setNewProjectName("");
  await loadProjects(user);
}

  async function deleteProject(projectId: string) {
    if (!confirm("Delete this project?")) return;

    const { error } = await supabase
      .from("projects")
      .delete()
      .eq("id", projectId);

    if (error) {
      alert(error.message);
      return;
    }

    if (user) {
      await loadProjects(user);
    }
  }

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);

      if (data.user) {
        loadProjects(data.user);
      }
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);

        if (session?.user) {
          loadProjects(session.user);
        } else {
          setProjects([]);
        }
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

                <button
                  style={styles.dangerButton}
                  onClick={() => deleteProject(project.id)}
                >
                  Delete
                </button>
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
  muted: {
    color: "#637083",
  },
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
  row: {
    display: "flex",
    gap: "8px",
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