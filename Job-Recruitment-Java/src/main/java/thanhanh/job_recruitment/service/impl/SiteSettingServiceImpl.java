package thanhanh.job_recruitment.service.impl;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import thanhanh.job_recruitment.domain.SiteSetting;
import thanhanh.job_recruitment.repository.SiteSettingRepository;
import thanhanh.job_recruitment.service.SiteSettingService;
import thanhanh.job_recruitment.util.SecurityUtil;

import java.time.Instant;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class SiteSettingServiceImpl implements SiteSettingService {

    private final SiteSettingRepository siteSettingRepository;

    public SiteSettingServiceImpl(SiteSettingRepository siteSettingRepository) {
        this.siteSettingRepository = siteSettingRepository;
    }

    @Override
    public SiteSetting getByKey(String key) {
        return this.siteSettingRepository.findByKeyName(key).orElse(null);
    }

    @Override
    public List<SiteSetting> getAll() {
        return this.siteSettingRepository.findAll();
    }

    @Override
    public Map<String, String> getAllAsMap() {
        List<SiteSetting> list = this.siteSettingRepository.findAll();
        Map<String, String> map = new HashMap<>();
        for (SiteSetting setting : list) {
            map.put(setting.getKeyName(), setting.getValue());
        }
        return map;
    }

    @Override
    @Transactional
    public SiteSetting update(String key, String value, String description) {
        String currentEmail = SecurityUtil.getCurrentUserLogin().orElse("system");
        Optional<SiteSetting> opt = this.siteSettingRepository.findByKeyName(key);
        SiteSetting setting;
        if (opt.isPresent()) {
            setting = opt.get();
            setting.setValue(value);
            if (description != null && !description.isBlank()) {
                setting.setDescription(description);
            }
            setting.setUpdatedBy(currentEmail);
            setting.setUpdatedAt(Instant.now());
        } else {
            setting = new SiteSetting();
            setting.setKeyName(key);
            setting.setValue(value);
            setting.setDescription(description != null ? description : key);
            setting.setUpdatedBy(currentEmail);
            setting.setCreatedAt(Instant.now());
            setting.setUpdatedAt(Instant.now());
        }
        return this.siteSettingRepository.save(setting);
    }

    @Override
    @Transactional
    public void batchUpdate(Map<String, String> settings) {
        String currentEmail = SecurityUtil.getCurrentUserLogin().orElse("system");
        for (Map.Entry<String, String> entry : settings.entrySet()) {
            String key = entry.getKey();
            String value = entry.getValue();
            Optional<SiteSetting> opt = this.siteSettingRepository.findByKeyName(key);
            SiteSetting setting;
            if (opt.isPresent()) {
                setting = opt.get();
                setting.setValue(value);
                setting.setUpdatedBy(currentEmail);
                setting.setUpdatedAt(Instant.now());
            } else {
                setting = new SiteSetting();
                setting.setKeyName(key);
                setting.setValue(value);
                setting.setDescription(key);
                setting.setUpdatedBy(currentEmail);
                setting.setCreatedAt(Instant.now());
                setting.setUpdatedAt(Instant.now());
            }
            this.siteSettingRepository.save(setting);
        }
    }
}
