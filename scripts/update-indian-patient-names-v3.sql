-- Update all patient names to Indian names
UPDATE patients SET 
  name = CASE 
    WHEN id = (SELECT id FROM patients ORDER BY id LIMIT 1 OFFSET 0) THEN 'Rajesh Kumar Sharma'
    WHEN id = (SELECT id FROM patients ORDER BY id LIMIT 1 OFFSET 1) THEN 'Sunita Devi Patel'
    WHEN id = (SELECT id FROM patients ORDER BY id LIMIT 1 OFFSET 2) THEN 'Amit Singh Chauhan'
    WHEN id = (SELECT id FROM patients ORDER BY id LIMIT 1 OFFSET 3) THEN 'Priya Kumari Gupta'
    WHEN id = (SELECT id FROM patients ORDER BY id LIMIT 1 OFFSET 4) THEN 'Vikram Singh Rathore'
    WHEN id = (SELECT id FROM patients ORDER BY id LIMIT 1 OFFSET 5) THEN 'Kavita Sharma Agarwal'
    WHEN id = (SELECT id FROM patients ORDER BY id LIMIT 1 OFFSET 6) THEN 'Deepak Kumar Jain'
    WHEN id = (SELECT id FROM patients ORDER BY id LIMIT 1 OFFSET 7) THEN 'Meera Devi Verma'
    ELSE name
  END,
  caretaker_name = CASE 
    WHEN id = (SELECT id FROM patients ORDER BY id LIMIT 1 OFFSET 0) THEN 'Priya Sharma'
    WHEN id = (SELECT id FROM patients ORDER BY id LIMIT 1 OFFSET 1) THEN 'Ramesh Patel'
    WHEN id = (SELECT id FROM patients ORDER BY id LIMIT 1 OFFSET 2) THEN 'Sita Chauhan'
    WHEN id = (SELECT id FROM patients ORDER BY id LIMIT 1 OFFSET 3) THEN 'Raj Gupta'
    WHEN id = (SELECT id FROM patients ORDER BY id LIMIT 1 OFFSET 4) THEN 'Sunita Rathore'
    WHEN id = (SELECT id FROM patients ORDER BY id LIMIT 1 OFFSET 5) THEN 'Mohan Agarwal'
    WHEN id = (SELECT id FROM patients ORDER BY id LIMIT 1 OFFSET 6) THEN 'Geeta Jain'
    WHEN id = (SELECT id FROM patients ORDER BY id LIMIT 1 OFFSET 7) THEN 'Suresh Verma'
    ELSE caretaker_name
  END;
