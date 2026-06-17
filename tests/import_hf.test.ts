// @ts-ignore
import { uuidFromHash, mapExpertiseLevel, mapTightnessTags, mapGoalTags, transformPose, mergeRoutines } from '../supabase/import_hf_dataset';

describe('Hugging Face Yoga Poses Import Mapping & Utility Tests', () => {
  
  test('uuidFromHash generates deterministic and valid UUIDs', () => {
    const name1 = 'Big Toe Pose';
    const name2 = 'Gorilla Pose';
    
    const uuid1 = uuidFromHash(name1);
    const uuid2 = uuidFromHash(name2);
    const uuid1_again = uuidFromHash(name1);
    
    // Deterministic checks
    expect(uuid1).toBe(uuid1_again);
    expect(uuid1).not.toBe(uuid2);
    
    // Format check (standard UUID regex)
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    expect(uuidRegex.test(uuid1)).toBe(true);
    expect(uuidRegex.test(uuid2)).toBe(true);
  });

  test('mapExpertiseLevel maps correct levels and handles defaults', () => {
    expect(mapExpertiseLevel('Beginner')).toBe('beginner');
    expect(mapExpertiseLevel('Intermediate')).toBe('intermediate');
    expect(mapExpertiseLevel('Advanced')).toBe('advanced');
    expect(mapExpertiseLevel('')).toBe('beginner');
    expect(mapExpertiseLevel(null as any)).toBe('beginner');
  });

  test('mapTightnessTags applies correct tags based on pose types and names', () => {
    expect(mapTightnessTags(['Forward Bend'], 'Big Toe Pose')).toEqual(
      expect.arrayContaining(['hamstrings', 'lower_back'])
    );
    expect(mapTightnessTags(['Back Bend'], 'Cobra Pose')).toEqual(
      expect.arrayContaining(['lower_back', 'shoulders', 'spine'])
    );
    expect(mapTightnessTags(['Twist'], 'Seated Twist')).toEqual(
      expect.arrayContaining(['spine', 'lower_back'])
    );
    expect(mapTightnessTags(['Standing'], 'Warrior')).toEqual(['hips']);
    expect(mapTightnessTags(['Seated'], 'Lotus')).toEqual(['hips']);
    expect(mapTightnessTags([], 'Shoulder Stand')).toEqual(['shoulders']);
    expect(mapTightnessTags([], 'Neck Release')).toEqual(['neck']);
    expect(mapTightnessTags([], 'Heart Melter')).toEqual(['chest']);
  });

  test('mapGoalTags applies correct goals based on pose types and names', () => {
    // All get mobility
    expect(mapGoalTags(['Forward Bend'], 'Corpse Pose')).toContain('mobility');

    // Restful poses
    expect(mapGoalTags(['Forward Bend'], 'Corpse Pose')).toContain('stress');
    expect(mapGoalTags(['Forward Bend'], 'Corpse Pose')).toContain('sleep');
    expect(mapGoalTags([], 'Child\'s Pose')).toContain('stress');

    // Strength/Power
    expect(mapGoalTags(['Standing'], 'Warrior I')).toContain('strength');
    expect(mapGoalTags(['Back Bend'], 'Cobra')).toContain('strength');
    expect(mapGoalTags([], 'Plank')).toContain('strength');

    // Balancing
    expect(mapGoalTags(['Standing', 'Balancing'], 'Tree')).toContain('focus');
    expect(mapGoalTags(['Standing', 'Balancing'], 'Tree')).toContain('strength');
  });

  test('transformPose correctly processes raw Hugging Face row', () => {
    const rawPose = {
      name: 'Eagle Pose',
      sanskrit_name: 'Garudasana',
      expertise_level: 'Beginner',
      pose_type: ['Standing', 'Balancing'],
      photo_url: 'https://example.com/eagle.png',
      followup_poses: null
    };

    const routine = transformPose(rawPose);

    expect(routine.title).toBe('Eagle Pose');
    expect(routine.category).toBe('asana');
    expect(routine.experience_level).toBe('beginner');
    expect(routine.is_premium).toBe(false);
    expect(routine.thumbnail_url).toBe('https://example.com/eagle.png');
    expect(routine.media_url).toBe('https://vjs.zencdn.net/v/oceans.mp4');
    expect(routine.sanskrit_terms).toEqual({ Garudasana: 'Eagle Pose' });
    expect(routine.goals).toEqual(expect.arrayContaining(['mobility', 'focus', 'strength']));
  });

  test('mergeRoutines combines existing and new routines without duplicates', () => {
    const existing = [
      { id: '1', title: 'Old Pose', category: 'asana' }
    ];
    const incoming = [
      { id: '1', title: 'Old Pose Updated', category: 'asana' },
      { id: '2', title: 'New Pose', category: 'asana' }
    ];

    const merged = mergeRoutines(existing, incoming);
    expect(merged.length).toBe(2);
    expect(merged.find((r: any) => r.id === '1')?.title).toBe('Old Pose Updated'); // Upsert behavior
    expect(merged.find((r: any) => r.id === '2')?.title).toBe('New Pose');
  });
});
