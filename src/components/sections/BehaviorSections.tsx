import { Mouse, Type, Scroll, Eye, Zap, Clipboard, Activity } from 'lucide-react';
import { useProfileStore } from '../../store/useProfileStore';
import { DataSection, DataRow, StatusRow } from '../ui/DataSection';

export function MouseBehaviorSection() {
  const { behavioral } = useProfileStore();
  const { mouse } = behavioral;

  return (
    <DataSection title="Mouse Behavior" icon={<Mouse size={14} />} iconColor="text-cyber-cyan">
      <DataRow label="Speed" value={`${mouse.averageVelocity.toFixed(1)} px/s`} />
      <DataRow label="Acceleration" value={mouse.acceleration.toFixed(2)} />
      <DataRow label="Movements" value={mouse.movements} />
      <DataRow label="Distance" value={`${mouse.totalDistance} px`} />
      <DataRow label="Idle Time" value={`${(mouse.idleTime / 1000).toFixed(0)}s`} />
      <DataRow label="Clicks" value={mouse.totalClicks} />
      <DataRow label="Click Interval" value={mouse.clickInterval ? `${mouse.clickInterval}ms` : '—'} />
    </DataSection>
  );
}

export function ScrollBehaviorSection() {
  const { behavioral } = useProfileStore();
  const { scroll } = behavioral;

  return (
    <DataSection title="Scroll Behavior" icon={<Scroll size={14} />} iconColor="text-cyber-purple">
      <DataRow label="Speed" value={`${scroll.speed} px/s`} />
      <DataRow label="Max Depth" value={`${scroll.maxDepth}%`} />
      <DataRow label="Direction Changes" value={scroll.directionChanges} />
      <DataRow label="Scroll Events" value={scroll.scrollEvents} />
    </DataSection>
  );
}

export function TypingBehaviorSection() {
  const { behavioral } = useProfileStore();
  const { typing } = behavioral;

  return (
    <DataSection title="Typing Behavior" icon={<Type size={14} />} iconColor="text-cyber-green">
      <DataRow label="Keys Pressed" value={typing.totalKeystrokes} />
      <DataRow label="Hold Time" value={typing.averageHoldTime > 0 ? `${typing.averageHoldTime}ms` : '—'} />
      <DataRow label="Key Interval" value={typing.keyInterval ? `${typing.keyInterval}ms` : '—'} />
      <DataRow label="Typing Speed" value={`${typing.averageWPM} CPM`} />
    </DataSection>
  );
}

export function AttentionTrackingSection() {
  const { behavioral } = useProfileStore();
  const { attention } = behavioral;

  const sessionDuration = Date.now() - attention.sessionStart;
  const hours = Math.floor(sessionDuration / (1000 * 60 * 60));
  const minutes = Math.floor((sessionDuration % (1000 * 60 * 60)) / (1000 * 60));

  return (
    <DataSection title="Attention Tracking" icon={<Eye size={14} />} iconColor="text-cyber-yellow">
      <DataRow label="Tab Switches" value={attention.tabSwitches} />
      <DataRow label="Focus Time" value={`${Math.round(attention.focusTime / 1000)}s`} />
      <DataRow label="Away Time" value={`${attention.totalHiddenTime}ms`} />
      <DataRow label="Session Duration" value={`${hours}h ${minutes}m`} />
      <DataRow label="First Interaction" value={attention.firstInteraction ? `${attention.firstInteraction}ms` : '—'} />
    </DataSection>
  );
}

export function YouRightNowSection() {
  const { behavioral, botDetection } = useProfileStore();
  const { mouse, attention } = behavioral;

  const idleTime = mouse.idleTime;

  return (
    <DataSection title="You Right Now" icon={<Activity size={14} />} iconColor="text-cyber-red">
      <StatusRow label="DevTools Open" detected={botDetection.devToolsOpen} alertOnDetect />
      <DataRow label="Status" value={attention.isVisible ? 'Active' : 'Inactive'} valueColor={attention.isVisible ? 'text-cyber-green' : 'text-cyber-text-dim'} />
      <DataRow label="Idle Time" value={`${idleTime}ms`} />
      <DataRow label="Times Went AFK" value={attention.timesWentAFK} />
      <StatusRow label="Mouse In Window" detected={mouse.inWindow} />
    </DataSection>
  );
}

export function EmotionsSection() {
  const { behavioral } = useProfileStore();
  const { emotions } = behavioral;

  return (
    <DataSection title="Your Emotions" icon={<Zap size={14} />} iconColor="text-cyber-red">
      <DataRow label="Rage Clicks" value={emotions.rageClicks} valueColor={emotions.rageClicks > 0 ? 'text-cyber-red' : 'text-cyber-text'} />
      <DataRow label="Exit Intents" value={emotions.exitIntents} />
      <DataRow label="Engagement" value={`${emotions.engagement}%`} valueColor={emotions.engagement >= 50 ? 'text-cyber-green' : 'text-cyber-yellow'} />
      <DataRow label="Handedness" value={`${emotions.handedness} (${emotions.handednessConfidence}% conf)`} />
    </DataSection>
  );
}

export function CopyPasteSection() {
  const { behavioral } = useProfileStore();
  const { copyPaste } = behavioral;

  return (
    <DataSection title="Copy/Paste Activity" icon={<Clipboard size={14} />} iconColor="text-cyber-purple">
      <DataRow label="Text Selections" value={copyPaste.textSelections} />
      <DataRow
        label="Last Selected"
        value={copyPaste.lastSelected ? (copyPaste.lastSelected.length > 35 ? copyPaste.lastSelected.substring(0, 35) + '...' : copyPaste.lastSelected) : '—'}
      />
      <DataRow label="Copies" value={copyPaste.copies} />
      <DataRow label="Pastes" value={copyPaste.pastes} />
      <DataRow label="Right Clicks" value={copyPaste.rightClicks} />
      <DataRow label="Screenshot Attempts" value={copyPaste.screenshotAttempts} />
    </DataSection>
  );
}
