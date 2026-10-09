import React, { useState } from 'react';
import { StudyRoadmap, StudyRoadmapTask } from './types';
import { CheckCircle2, Circle, Calendar, Clock, Flame, Sparkles, Check, Copy } from 'lucide-react';

interface StudyRoadmapCardProps {
  roadmap: StudyRoadmap;
}

export const StudyRoadmapCard: React.FC<StudyRoadmapCardProps> = ({ roadmap }) => {
  const [activePhaseIndex, setActivePhaseIndex] = useState(0);
  const [taskState, setTaskState] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    roadmap.phases.forEach((phase) => {
      phase.tasks.forEach((task) => {
        initial[task.id] = task.completed;
      });
    });
    return initial;
  });
  const [copied, setCopied] = useState(false);

  // Calculate overall stats
  const allTasks: StudyRoadmapTask[] = roadmap.phases.flatMap((p) => p.tasks);
  const totalTasks = allTasks.length;
  const completedCount = allTasks.filter((t) => taskState[t.id]).length;
  const progressPercent = Math.round((completedCount / (totalTasks || 1)) * 100);

  const toggleTask = (taskId: string) => {
    setTaskState((prev) => ({
      ...prev,
      [taskId]: !prev[taskId],
    }));
  };

  const copyRoadmapAsText = () => {
    const textLines = [
      `📚 ${roadmap.title} (${roadmap.totalDays} Days Roadmap)`,
      `Subject: ${roadmap.subject} | Commitment: ${roadmap.dailyCommitment}`,
      `Progress: ${completedCount}/${totalTasks} tasks completed (${progressPercent}%)\n`,
    ];

    roadmap.phases.forEach((phase) => {
      textLines.push(`--- ${phase.name}: ${phase.subtitle} ---`);
      phase.tasks.forEach((task) => {
        const isDone = taskState[task.id] ? '[✓]' : '[ ]';
        textLines.push(`${isDone} ${task.day} - ${task.title} (${task.estimatedHours})`);
        textLines.push(`    Topics: ${task.targetTopics.join(', ')}`);
      });
      textLines.push('');
    });

    navigator.clipboard.writeText(textLines.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const currentPhase = roadmap.phases[activePhaseIndex] || roadmap.phases[0];

  return (
    <div className="mt-4 rounded-xl border border-indigo-100 bg-gradient-to-b from-white to-slate-50/70 p-4 shadow-sm transition-all sm:p-5">
      {/* Header with Title & Stats */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 ring-1 ring-indigo-200">
            <Calendar className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-semibold text-slate-900 sm:text-base">
                {roadmap.title}
              </h4>
              <span className="inline-flex items-center rounded-full bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-700/10">
                {roadmap.totalDays} Days Plan
              </span>
            </div>
            <p className="text-xs text-slate-500">
              {roadmap.subject} • Daily target: {roadmap.dailyCommitment}
            </p>
          </div>
        </div>

        <button
          onClick={copyRoadmapAsText}
          className="inline-flex items-center gap-1.5 self-start rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 sm:self-center"
          title="Copy roadmap to clipboard"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 text-emerald-600" />
              <span className="text-emerald-700 font-medium">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5 text-slate-500" />
              <span>Export Plan</span>
            </>
          )}
        </button>
      </div>

      {/* Progress Bar */}
      <div className="mt-4">
        <div className="flex items-center justify-between text-xs font-medium text-slate-600 mb-1.5">
          <span className="flex items-center gap-1">
            <Sparkles className="h-3.5 w-3.5 text-indigo-500" />
            <span>Preparation Progress</span>
          </span>
          <span className="font-semibold text-indigo-600">
            {completedCount} of {totalTasks} Completed ({progressPercent}%)
          </span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-emerald-500 transition-all duration-500 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Phase Tabs */}
      <div className="mt-4 flex gap-1.5 border-b border-slate-200/80 pb-2">
        {roadmap.phases.map((phase, idx) => {
          const isActive = idx === activePhaseIndex;
          const phaseTasks = phase.tasks;
          const phaseCompleted = phaseTasks.filter((t) => taskState[t.id]).length;

          return (
            <button
              key={phase.name}
              onClick={() => setActivePhaseIndex(idx)}
              className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <span>{phase.name}</span>
              <span
                className={`rounded-full px-1.5 py-0.5 text-[10px] font-semibold ${
                  isActive ? 'bg-indigo-700 text-white' : 'bg-slate-200 text-slate-700'
                }`}
              >
                {phaseCompleted}/{phaseTasks.length}
              </span>
            </button>
          );
        })}
      </div>

      {/* Phase Subtitle */}
      <div className="mt-2.5 flex items-center justify-between text-xs text-slate-500">
        <span className="font-medium text-slate-700">{currentPhase.subtitle}</span>
        <span>Click checkbox to track your study goals</span>
      </div>

      {/* Task List */}
      <div className="mt-3 space-y-2">
        {currentPhase.tasks.map((task) => {
          const isDone = !!taskState[task.id];

          return (
            <div
              key={task.id}
              onClick={() => toggleTask(task.id)}
              className={`group flex cursor-pointer items-start gap-3 rounded-lg border p-2.5 transition-all ${
                isDone
                  ? 'border-emerald-200/80 bg-emerald-50/40 text-slate-500'
                  : 'border-slate-200/80 bg-white hover:border-indigo-200 hover:bg-slate-50/50'
              }`}
            >
              <button
                type="button"
                className="mt-0.5 text-slate-400 group-hover:text-indigo-600 transition-colors"
                aria-label={isDone ? 'Mark task incomplete' : 'Mark task complete'}
              >
                {isDone ? (
                  <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                ) : (
                  <Circle className="h-5 w-5" />
                )}
              </button>

              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-slate-600 ${
                      isDone ? 'line-through text-slate-400' : ''
                    }`}
                  >
                    {task.day}
                  </span>
                  <span
                    className={`text-xs font-semibold ${
                      isDone ? 'line-through text-slate-400' : 'text-slate-800'
                    }`}
                  >
                    {task.title}
                  </span>

                  {task.highWeightage && (
                    <span className="inline-flex items-center gap-1 rounded bg-amber-50 px-1.5 py-0.5 text-[10px] font-medium text-amber-700 ring-1 ring-inset ring-amber-600/20">
                      <Flame className="h-3 w-3 text-amber-500" />
                      High Weightage
                    </span>
                  )}
                </div>

                <p
                  className={`mt-1 text-xs leading-relaxed ${
                    isDone ? 'line-through text-slate-400' : 'text-slate-600'
                  }`}
                >
                  {task.description}
                </p>

                {/* Topics pills and hours */}
                <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap gap-1">
                    {task.targetTopics.map((topic) => (
                      <span
                        key={topic}
                        className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] text-slate-600"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-1 text-[11px] font-medium text-slate-500">
                    <Clock className="h-3 w-3" />
                    <span>{task.estimatedHours}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
