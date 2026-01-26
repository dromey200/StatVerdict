// ====================================
// HORADRIC AI - GOOGLE ANALYTICS (ENHANCED)
// ====================================

/**
 * Comprehensive Analytics Module for Horadric AI
 * Tracks ALL user interactions, performance, and behaviors
 * GA4 Measurement ID: G-E1JZ16DMSF
 */

const Analytics = {
    // Track if analytics is ready
    isReady: false,
    
    // Session tracking
    sessionStart: Date.now(),
    sessionEvents: 0,
    sessionInteractions: {},
    scrollDepth: 0,
    maxScrollDepth: 0,
    
    // Feature usage tracking
    featuresUsed: new Set(),
    
    // Performance tracking
    performanceMarks: {},
    
    /**
     * Initialize analytics tracking
     */
    init() {
        if (typeof gtag === 'undefined') {
            console.warn('Google Analytics not loaded');
            return;
        }
        
        this.isReady = true;
        this.trackPageLoad();
        this.setupAutoTracking();
        this.setupScrollTracking();
        this.setupEngagementTracking();
        this.setupPerformanceTracking();
        console.log('✔️ Analytics initialized (Enhanced Mode)');
    },
    
    /**
     * Track page load and initial context
     */
    trackPageLoad() {
        this.track('page_view', {
            page_title: document.title,
            page_location: window.location.href,
            device_type: this.getDeviceType(),
            browser: this.getBrowser(),
            screen_size: `${window.innerWidth}x${window.innerHeight}`,
            referrer: document.referrer || 'direct',
            viewport_size: `${window.innerWidth}x${window.innerHeight}`,
            pixel_ratio: window.devicePixelRatio || 1,
            color_depth: screen.colorDepth,
            is_mobile: /iPhone|iPad|iPod|Android/i.test(navigator.userAgent),
            connection_type: this.getConnectionType()
        });
        
        // Track page load performance
        window.addEventListener('load', () => {
            const perfData = performance.timing;
            const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
            
            this.track('page_load_performance', {
                load_time_ms: pageLoadTime,
                dom_ready_ms: perfData.domContentLoadedEventEnd - perfData.navigationStart,
                server_response_ms: perfData.responseEnd - perfData.requestStart,
                event_category: 'performance'
            });
        });
    },
    
    /**
     * Setup automatic tracking for elements with data-ga-event attribute
     */
    setupAutoTracking() {
        // Click tracking
        document.addEventListener('click', (e) => {
            const element = e.target.closest('[data-ga-event]');
            if (element) {
                const eventName = element.getAttribute('data-ga-event');
                const eventData = {
                    element_id: element.id || 'unknown',
                    element_type: element.tagName.toLowerCase(),
                    element_text: element.textContent?.substring(0, 50) || '',
                    element_classes: element.className || '',
                    click_x: e.clientX,
                    click_y: e.clientY
                };
                this.track(eventName, eventData);
                
                // Track feature first use
                if (!this.featuresUsed.has(eventName)) {
                    this.featuresUsed.add(eventName);
                    this.trackFeatureFirstUse(eventName);
                }
            }
        });
        
        // Form submissions
        document.addEventListener('submit', (e) => {
            const form = e.target;
            if (form.id) {
                this.track('form_submit', {
                    form_id: form.id,
                    form_action: form.action,
                    form_method: form.method,
                    event_category: 'conversion'
                });
            }
        });
        
        // Input focus (engagement signal)
        document.addEventListener('focus', (e) => {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') {
                const fieldId = e.target.id || e.target.name || 'unknown';
                this.track('form_field_focus', {
                    field_id: fieldId,
                    field_type: e.target.type || e.target.tagName.toLowerCase(),
                    event_category: 'engagement'
                });
            }
        }, true);
        
        // Input blur with value check
        document.addEventListener('blur', (e) => {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
                const fieldId = e.target.id || e.target.name || 'unknown';
                const hasValue = e.target.value && e.target.value.length > 0;
                
                this.track('form_field_blur', {
                    field_id: fieldId,
                    field_type: e.target.type || e.target.tagName.toLowerCase(),
                    has_value: hasValue,
                    value_length: e.target.value?.length || 0,
                    event_category: 'engagement'
                });
            }
        }, true);
        
        // Link clicks
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a');
            if (link && link.href) {
                const isExternal = !link.href.includes(window.location.hostname);
                this.track('link_click', {
                    link_url: link.href,
                    link_text: link.textContent?.substring(0, 50),
                    is_external: isExternal,
                    opens_new_tab: link.target === '_blank',
                    event_category: 'navigation'
                });
            }
        });
        
        // Button hover intent (predictive)
        let hoverTimeout;
        document.addEventListener('mouseenter', (e) => {
            if (e.target.tagName === 'BUTTON') {
                hoverTimeout = setTimeout(() => {
                    this.track('button_hover_intent', {
                        button_id: e.target.id || 'unknown',
                        button_text: e.target.textContent?.substring(0, 30),
                        hover_duration_ms: 500,
                        event_category: 'engagement'
                    });
                }, 500);
            }
        }, true);
        
        document.addEventListener('mouseleave', () => {
            clearTimeout(hoverTimeout);
        }, true);
    },
    
    /**
     * Setup scroll depth tracking
     */
    setupScrollTracking() {
        let ticking = false;
        
        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    const scrollPercent = Math.round(
                        (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
                    );
                    
                    this.scrollDepth = scrollPercent;
                    
                    if (scrollPercent > this.maxScrollDepth) {
                        this.maxScrollDepth = scrollPercent;
                        
                        // Track milestones
                        if ([25, 50, 75, 90, 100].includes(scrollPercent)) {
                            this.track('scroll_depth', {
                                depth_percent: scrollPercent,
                                page_height: document.documentElement.scrollHeight,
                                event_category: 'engagement',
                                event_value: scrollPercent
                            });
                        }
                    }
                    
                    ticking = false;
                });
                
                ticking = true;
            }
        });
    },
    
    /**
     * Setup engagement tracking
     */
    setupEngagementTracking() {
        // Track time on page milestones
        [30, 60, 120, 300, 600].forEach(seconds => {
            setTimeout(() => {
                this.track('time_on_page', {
                    seconds: seconds,
                    scroll_depth: this.maxScrollDepth,
                    interactions: this.sessionEvents,
                    event_category: 'engagement',
                    event_value: seconds
                });
            }, seconds * 1000);
        });
        
        // Track idle vs active time
        let idleTime = 0;
        let activeTime = 0;
        let lastActive = Date.now();
        let isIdle = false;
        
        const idleInterval = setInterval(() => {
            const now = Date.now();
            const timeSinceActive = now - lastActive;
            
            if (timeSinceActive > 30000 && !isIdle) {
                isIdle = true;
                this.track('user_idle', {
                    active_time_seconds: Math.round(activeTime / 1000),
                    event_category: 'engagement'
                });
            }
            
            if (isIdle) {
                idleTime += 1000;
            } else {
                activeTime += 1000;
            }
        }, 1000);
        
        ['mousemove', 'keydown', 'scroll', 'click', 'touchstart'].forEach(eventType => {
            document.addEventListener(eventType, () => {
                if (isIdle) {
                    isIdle = false;
                    this.track('user_active', {
                        idle_time_seconds: Math.round(idleTime / 1000),
                        event_category: 'engagement'
                    });
                }
                lastActive = Date.now();
            }, { passive: true });
        });
        
        // Visibility change (tab switching)
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.track('tab_hidden', {
                    time_visible_seconds: Math.round((Date.now() - this.sessionStart) / 1000),
                    event_category: 'engagement'
                });
            } else {
                this.track('tab_visible', {
                    event_category: 'engagement'
                });
            }
        });
    },
    
    /**
     * Setup performance tracking
     */
    setupPerformanceTracking() {
        // Track resource loading
        if (window.PerformanceObserver) {
            const perfObserver = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    if (entry.entryType === 'resource') {
                        // Track slow resources
                        if (entry.duration > 1000) {
                            this.track('slow_resource', {
                                resource_name: entry.name.split('/').pop(),
                                duration_ms: Math.round(entry.duration),
                                resource_type: entry.initiatorType,
                                event_category: 'performance'
                            });
                        }
                    }
                }
            });
            
            try {
                perfObserver.observe({ entryTypes: ['resource'] });
            } catch (e) {
                console.warn('Performance observer not supported:', e);
            }
        }
    },
    
    /**
     * Core tracking function
     */
    track(eventName, params = {}) {
        if (!this.isReady) return;
        
        this.sessionEvents++;
        
        const enrichedParams = {
            ...params,
            session_duration: Math.round((Date.now() - this.sessionStart) / 1000),
            session_events: this.sessionEvents,
            scroll_depth: this.maxScrollDepth,
            timestamp: new Date().toISOString()
        };
        
        gtag('event', eventName, enrichedParams);
        
        // Log in development
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            console.log(`📊 GA Event: ${eventName}`, enrichedParams);
        }
    },
    
    // ====================================
    // PROVIDER & MODEL TRACKING
    // ====================================
    
    trackProviderSelected(provider, model) {
        this.track('provider_selected', {
            provider: provider,
            model: model,
            event_category: 'ai_configuration',
            event_label: `${provider}_${model}`
        });
    },
    
    trackModelSelected(provider, model, isRecommended) {
        this.track('model_selected', {
            provider: provider,
            model: model,
            is_recommended: isRecommended,
            event_category: 'ai_configuration',
            event_label: model
        });
    },
    
    trackProviderSwitched(fromProvider, toProvider, reason) {
        this.track('provider_switched', {
            from_provider: fromProvider,
            to_provider: toProvider,
            reason: reason,
            event_category: 'ai_configuration',
            event_label: `${fromProvider}_to_${toProvider}`
        });
    },
    
    // ====================================
    // API KEY TRACKING
    // ====================================
    
    trackApiKeyEntered(provider, isValid) {
        this.track('api_key_entered', {
            provider: provider,
            is_valid: isValid,
            event_category: 'authentication',
            event_label: isValid ? 'valid' : 'invalid'
        });
    },
    
    trackApiKeyValidationError(provider, errorType) {
        this.track('api_key_validation_error', {
            provider: provider,
            error_type: errorType,
            event_category: 'error',
            event_label: errorType
        });
    },
    
    trackGetApiKeyClicked(provider) {
        this.track('get_api_key_clicked', {
            provider: provider,
            event_category: 'conversion',
            event_label: 'api_key_acquisition'
        });
    },
    
    // ====================================
    // USER PREFERENCES TRACKING
    // ====================================
    
    trackClassSelected(className) {
        this.track('class_selected', {
            class: className,
            event_category: 'user_preference',
            event_label: className
        });
    },
    
    trackClassChanged(fromClass, toClass) {
        this.track('class_changed', {
            from_class: fromClass,
            to_class: toClass,
            event_category: 'user_preference'
        });
    },
    
    // ====================================
    // IMAGE UPLOAD TRACKING
    // ====================================
    
    trackImageSelected(fileSize, fileType) {
        const fileSizeMB = (fileSize / (1024 * 1024)).toFixed(2);
        this.track('image_selected', {
            file_size_mb: fileSizeMB,
            file_type: fileType,
            event_category: 'content',
            event_value: Math.round(fileSize / 1024) // KB
        });
    },
    
    trackImageUploadError(errorType, fileSize, fileType) {
        this.track('image_upload_error', {
            error_type: errorType,
            file_size_mb: fileSize ? (fileSize / (1024 * 1024)).toFixed(2) : 'unknown',
            file_type: fileType || 'unknown',
            event_category: 'error',
            event_label: errorType
        });
    },
    
    trackImageCompression(originalSize, compressedSize, compressionRatio) {
        this.track('image_compression', {
            original_size_mb: (originalSize / (1024 * 1024)).toFixed(2),
            compressed_size_mb: (compressedSize / (1024 * 1024)).toFixed(2),
            compression_ratio: compressionRatio.toFixed(2),
            savings_percent: Math.round((1 - compressionRatio) * 100),
            event_category: 'performance'
        });
    },
    
    // ====================================
    // ANALYSIS TRACKING
    // ====================================
    
    trackAnalysisStarted(provider, model, fileSize, playerClass) {
        const fileSizeMB = (fileSize / (1024 * 1024)).toFixed(2);
        this.track('analysis_started', {
            provider: provider,
            model: model,
            file_size_mb: fileSizeMB,
            player_class: playerClass,
            event_category: 'analysis',
            event_label: `${provider}_${model}`,
            event_value: Math.round(fileSize / 1024)
        });
        
        // Mark start time for duration calculation
        this.performanceMarks[`analysis_${provider}_start`] = Date.now();
    },
    
    trackAnalysisCompleted(provider, model, duration, rarity, estimatedCost) {
        this.track('analysis_completed', {
            provider: provider,
            model: model,
            duration_seconds: duration,
            item_rarity: rarity,
            estimated_cost: estimatedCost,
            event_category: 'analysis',
            event_label: `${provider}_${model}_success`,
            event_value: Math.round(duration * 100)
        });
        
        // Track performance milestone
        if (duration < 3) {
            this.track('fast_analysis', {
                provider: provider,
                duration_seconds: duration,
                event_category: 'performance'
            });
        } else if (duration > 10) {
            this.track('slow_analysis', {
                provider: provider,
                duration_seconds: duration,
                event_category: 'performance'
            });
        }
    },
    
    trackAnalysisFailed(provider, model, errorType, errorMessage) {
        this.track('analysis_failed', {
            provider: provider,
            model: model,
            error_type: errorType,
            error_message: errorMessage?.substring(0, 100),
            event_category: 'error',
            event_label: `${provider}_${errorType}`
        });
    },
    
    trackAnalysisCancelled(provider, model, durationBeforeCancel) {
        this.track('analysis_cancelled', {
            provider: provider,
            model: model,
            duration_before_cancel: durationBeforeCancel,
            event_category: 'user_action',
            event_label: 'cancelled'
        });
    },
    
    trackAnalysisRetried(provider, previousError) {
        this.track('analysis_retried', {
            provider: provider,
            previous_error: previousError,
            event_category: 'user_action',
            event_label: 'retry'
        });
    },
    
    // ====================================
    // RESULTS INTERACTION TRACKING
    // ====================================
    
    trackResultsViewed(rarity, duration) {
        this.track('results_viewed', {
            item_rarity: rarity,
            time_to_view_seconds: duration,
            event_category: 'engagement'
        });
    },
    
    trackResultsScrolled(scrollDepth) {
        this.track('results_scrolled', {
            scroll_depth_percent: scrollDepth,
            event_category: 'engagement'
        });
    },
    
    trackResultsCopied(method) {
        this.track('results_copied', {
            copy_method: method, // 'manual' or 'button'
            event_category: 'user_action'
        });
    },
    
    // ====================================
    // DEMO MODE TRACKING
    // ====================================
    
    trackDemoModeActivated(provider) {
        this.track('demo_mode_activated', {
            provider: provider,
            event_category: 'feature_usage',
            event_label: `demo_${provider}`
        });
    },
    
    trackDemoCompleted(provider, timeSpent) {
        this.track('demo_completed', {
            provider: provider,
            time_spent_seconds: timeSpent,
            event_category: 'feature_usage'
        });
    },
    
    trackDemoToRealConversion(provider) {
        this.track('demo_to_real_conversion', {
            provider: provider,
            event_category: 'conversion',
            event_label: 'demo_conversion'
        });
    },
    
    // ====================================
    // COST TRACKING
    // ====================================
    
    trackCostCalculated(provider, model, estimatedCost, scanNumber) {
        this.track('cost_calculated', {
            provider: provider,
            model: model,
            estimated_cost: estimatedCost,
            scan_number: scanNumber,
            event_category: 'cost_tracking',
            event_value: Math.round(estimatedCost * 10000)
        });
    },
    
    trackSessionCostSummary(totalScans, totalCost, avgCostPerScan) {
        this.track('session_cost_summary', {
            total_scans: totalScans,
            total_cost: totalCost,
            avg_cost_per_scan: avgCostPerScan,
            event_category: 'cost_tracking',
            event_value: Math.round(totalCost * 10000)
        });
    },
    
    trackCostThresholdReached(threshold, totalCost, scanCount) {
        this.track('cost_threshold_reached', {
            threshold: threshold,
            total_cost: totalCost,
            scan_count: scanCount,
            event_category: 'cost_tracking',
            event_label: `threshold_${threshold}`
        });
    },
    
    // ====================================
    // PRICE CHECKER TRACKING
    // ====================================
    
    trackPriceCheckToggled(itemName, rarity, hasPrice) {
        this.track('price_check_toggled', {
            item_name: itemName,
            item_rarity: rarity,
            has_price_data: hasPrice,
            event_category: 'feature_usage',
            event_label: hasPrice ? 'has_data' : 'no_data'
        });
    },
    
    trackPriceDataViewed(itemName, priceSource, tradeValue) {
        this.track('price_data_viewed', {
            item_name: itemName,
            price_source: priceSource,
            trade_value: tradeValue,
            event_category: 'pricing',
            event_label: priceSource
        });
    },
    
    trackPriceRefreshed(itemName) {
        this.track('price_refresh', {
            item_name: itemName,
            event_category: 'user_action',
            event_label: 'price_refresh'
        });
    },
    
    trackPriceReported(itemName, observedPrice, source) {
        this.track('price_reported', {
            item_name: itemName,
            observed_price: observedPrice,
            price_source: source,
            event_category: 'community_contribution',
            event_label: 'price_correction'
        });
    },
    
    trackPriceReportSubmitted(itemName, source, hasNotes) {
        this.track('price_report_submitted', {
            item_name: itemName,
            source: source,
            has_notes: hasNotes,
            event_category: 'community_contribution'
        });
    },
    
    trackViewTradeClicked(itemName) {
        this.track('view_trade_clicked', {
            item_name: itemName,
            event_category: 'external_navigation',
            event_label: 'diablo_trade'
        });
    },
    
    // ====================================
    // SHARING TRACKING
    // ====================================
    
    trackShareDiscord(rarity, provider) {
        this.track('share_discord', {
            item_rarity: rarity,
            provider_used: provider,
            event_category: 'sharing',
            event_label: 'discord'
        });
    },
    
    trackShareAttemptFailed(reason) {
        this.track('share_attempt_failed', {
            failure_reason: reason,
            event_category: 'error',
            event_label: 'share_failed'
        });
    },
    
    // ====================================
    // HISTORY TRACKING
    // ====================================
    
    trackHistoryViewed(itemCount) {
        this.track('history_viewed', {
            item_count: itemCount,
            event_category: 'feature_usage',
            event_label: 'history',
            event_value: itemCount
        });
    },
    
    trackHistoryItemClicked(itemRarity, itemAge) {
        this.track('history_item_clicked', {
            item_rarity: itemRarity,
            item_age_days: itemAge,
            event_category: 'user_action',
            event_label: 'history_recall'
        });
    },
    
    trackHistoryCleared(itemCount) {
        this.track('history_cleared', {
            items_cleared: itemCount,
            event_category: 'user_action',
            event_label: 'history_clear'
        });
    },
    
    trackHistoryItemDeleted(itemRarity) {
        this.track('history_item_deleted', {
            item_rarity: itemRarity,
            event_category: 'user_action',
            event_label: 'history_delete'
        });
    },
    
    trackHistoryFull() {
        this.track('history_full', {
            event_category: 'feature_limit',
            event_label: 'max_history_reached'
        });
    },
    
    // ====================================
    // MODAL & HELP TRACKING
    // ====================================
    
    trackHelpOpened(provider) {
        this.track('help_opened', {
            provider: provider,
            event_category: 'support',
            event_label: 'help_modal'
        });
    },
    
    trackHelpClosed(timeOpen) {
        this.track('help_closed', {
            time_open_seconds: timeOpen,
            event_category: 'support'
        });
    },
    
    trackPrivacyViewed() {
        this.track('privacy_viewed', {
            event_category: 'compliance',
            event_label: 'privacy_policy'
        });
    },
    
    trackModalInteraction(modalName, action) {
        this.track('modal_interaction', {
            modal_name: modalName,
            action: action,
            event_category: 'engagement'
        });
    },
    
    // ====================================
    // SUPPORT & FEEDBACK TRACKING
    // ====================================
    
    trackReportIssueClicked() {
        this.track('report_issue_clicked', {
            event_category: 'support',
            event_label: 'feedback'
        });
    },
    
    // ====================================
    // KIT (CONVERTKIT) FORM TRACKING
    // ====================================
    
    trackBetaSignupSubmit(email) {
        const emailDomain = email.split('@')[1] || 'unknown';
        this.track('beta_signup_submit', {
            email_domain: emailDomain,
            event_category: 'conversion',
            event_label: 'beta_list'
        });
    },
    
    trackBetaSignupSuccess() {
        this.track('beta_signup_success', {
            event_category: 'conversion',
            event_label: 'beta_confirmed'
        });
    },
    
    trackBetaSignupError(errorType) {
        this.track('beta_signup_error', {
            error_type: errorType,
            event_category: 'error',
            event_label: 'beta_signup_failed'
        });
    },
    
    // ====================================
    // ERROR TRACKING
    // ====================================
    
    trackError(errorType, errorMessage, context) {
        this.track('error_occurred', {
            error_type: errorType,
            error_message: errorMessage?.substring(0, 100),
            context: context,
            event_category: 'error',
            event_label: errorType
        });
    },
    
    trackErrorRecovery(errorType, recoveryMethod) {
        this.track('error_recovery', {
            error_type: errorType,
            recovery_method: recoveryMethod,
            event_category: 'user_action',
            event_label: 'error_recovery'
        });
    },
    
    trackValidationError(fieldName, errorType) {
        this.track('validation_error', {
            field_name: fieldName,
            error_type: errorType,
            event_category: 'error',
            event_label: `${fieldName}_${errorType}`
        });
    },
    
    // ====================================
    // PERFORMANCE TRACKING
    // ====================================
    
    trackPerformance(metric, value, context) {
        this.track('performance_metric', {
            metric_name: metric,
            metric_value: value,
            context: context,
            event_category: 'performance',
            event_label: metric
        });
    },
    
    trackAPIResponseTime(provider, responseTimeMs) {
        this.track('api_response_time', {
            provider: provider,
            response_time_ms: responseTimeMs,
            is_slow: responseTimeMs > 5000,
            event_category: 'performance',
            event_value: responseTimeMs
        });
    },
    
    // ====================================
    // FEATURE ADOPTION TRACKING
    // ====================================
    
    trackFeatureFirstUse(featureName) {
        this.track('feature_first_use', {
            feature_name: featureName,
            event_category: 'feature_adoption',
            event_label: featureName
        });
    },
    
    trackFeatureDiscovery(featureName, discoveryMethod) {
        this.track('feature_discovery', {
            feature_name: featureName,
            discovery_method: discoveryMethod, // 'organic', 'tooltip', 'demo'
            event_category: 'feature_adoption'
        });
    },
    
    // ====================================
    // USER JOURNEY TRACKING
    // ====================================
    
    trackMilestone(milestoneName, metadata) {
        this.track('milestone_reached', {
            milestone: milestoneName,
            ...metadata,
            event_category: 'user_journey',
            event_label: milestoneName
        });
    },
    
    trackUserJourneyStep(step, stepNumber, totalSteps) {
        this.track('journey_step', {
            step_name: step,
            step_number: stepNumber,
            total_steps: totalSteps,
            completion_percent: Math.round((stepNumber / totalSteps) * 100),
            event_category: 'user_journey'
        });
    },
    
    trackConversionFunnel(funnelStep, completed) {
        this.track('conversion_funnel', {
            funnel_step: funnelStep,
            completed: completed,
            event_category: 'conversion',
            event_label: completed ? 'completed' : 'abandoned'
        });
    },
    
    // ====================================
    // SESSION TRACKING
    // ====================================
    
    trackSessionEnd() {
        const sessionDuration = Math.round((Date.now() - this.sessionStart) / 1000);
        this.track('session_end', {
            session_duration_seconds: sessionDuration,
            total_events: this.sessionEvents,
            max_scroll_depth: this.maxScrollDepth,
            features_used: Array.from(this.featuresUsed).join(','),
            features_used_count: this.featuresUsed.size,
            event_category: 'engagement',
            event_value: sessionDuration
        });
    },
    
    trackSessionQuality(scansCompleted, errorCount, featuresUsed) {
        const quality = scansCompleted > 0 && errorCount < 3 ? 'high' : 
                       scansCompleted > 0 ? 'medium' : 'low';
        
        this.track('session_quality', {
            quality: quality,
            scans_completed: scansCompleted,
            error_count: errorCount,
            features_used: featuresUsed,
            event_category: 'engagement',
            event_label: quality
        });
    },
    
    // ====================================
    // UTILITY FUNCTIONS
    // ====================================
    
    /**
     * Get device type
     */
    getDeviceType() {
        const width = window.innerWidth;
        if (width < 768) return 'mobile';
        if (width < 1024) return 'tablet';
        return 'desktop';
    },
    
    /**
     * Get browser name
     */
    getBrowser() {
        const userAgent = navigator.userAgent;
        if (userAgent.indexOf('Firefox') > -1) return 'Firefox';
        if (userAgent.indexOf('Chrome') > -1) return 'Chrome';
        if (userAgent.indexOf('Safari') > -1) return 'Safari';
        if (userAgent.indexOf('Edge') > -1) return 'Edge';
        if (userAgent.indexOf('Opera') > -1) return 'Opera';
        return 'Other';
    },
    
    /**
     * Get connection type
     */
    getConnectionType() {
        const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
        if (!connection) return 'unknown';
        
        return connection.effectiveType || connection.type || 'unknown';
    },
    
    /**
     * Create custom dimension
     */
    setUserProperty(propertyName, value) {
        if (!this.isReady) return;
        gtag('set', 'user_properties', {
            [propertyName]: value
        });
    },
    
    /**
     * Track custom event with full control
     */
    trackCustom(eventName, params = {}) {
        this.track(eventName, params);
    },
    
    // ====================================
    // BUILD STYLE TRACKING
    // ====================================
    
    trackBuildStyleSelected(buildStyle) {
        this.track('build_style_selected', {
            build_style: buildStyle,
            event_category: 'user_preference',
            event_label: buildStyle
        });
    },
    
    trackBuildStyleChanged(fromBuild, toBuild) {
        this.track('build_style_changed', {
            from_build: fromBuild,
            to_build: toBuild,
            event_category: 'user_preference'
        });
    }
};

// ====================================
// INITIALIZE ANALYTICS
// ====================================

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => Analytics.init());
} else {
    Analytics.init();
}

// Track session end on page unload
window.addEventListener('beforeunload', () => {
    Analytics.trackSessionEnd();
});

// Track errors globally
window.addEventListener('error', (event) => {
    Analytics.trackError(
        'javascript_error',
        event.message,
        event.filename + ':' + event.lineno
    );
});

// Track unhandled promise rejections
window.addEventListener('unhandledrejection', (event) => {
    Analytics.trackError(
        'unhandled_promise',
        event.reason?.message || 'Unknown error',
        'promise_rejection'
    );
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Analytics;
}
